<template>
  <div
    class="message-logs"
    id="messageLogs"
    ref="logs"
    @scroll.passive="onScroll"
  >
    <transition-group :name="windowIsFocused ? 'message' : ''" tag="p">
      <component
        v-for="message in channelMessages"
        v-bind:is="messageType(message)"
        class="message"
        :key="message.tempID || message.messageID"
        :message="message"
      />
      <UploadQueue v-if="uploadQueue.length" key="upload-queue" />
    </transition-group>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { MessagesModule } from "@/store/modules/messages";
import MessageTemplate from "./message/MessageTemplate.vue";
import UploadQueue from "./message/UploadQueue.vue";
import ActionMessageTemplate from "./message/ActionMessageTemplate.vue";
import { ScrollModule } from "@/store/modules/scroll";
import windowProperties from "@/utils/windowProperties";
import { NotificationsModule } from "@/store/modules/notifications";
import { LastSeenServerChannelsModule } from "@/store/modules/lastSeenServerChannel";
import FileDragDrop from "@/utils/FileDragDrop";
import { FileUploadModule } from "@/store/modules/fileUpload";
import { PopoutsModule } from "@/store/modules/popouts";

@Component({
  components: { MessageTemplate, ActionMessageTemplate, UploadQueue }
})
export default class MessageLogs extends Vue {
  fileDragDropHandler: FileDragDrop | undefined;
  mounted() {
    ScrollModule.SetScrolledBottom(true);
    this.scrollDown();
    this.fileDragDropHandler = new FileDragDrop();
    this.fileDragDropHandler.onDragEnter(this.fileDragEnter);
    this.fileDragDropHandler.onDrop(this.fileDrop);
    this.fileDragDropHandler.onDragOut(this.fileDragOut);
  }
  beforeDestroy() {
    this.fileDragDropHandler?.destroy();
  }
  fileDragEnter() {
    PopoutsModule.ShowPopout({
      id: "file-drag",
      component: "Drag-drop-popout",
      data: {}
    });
  }
  fileDragOut() {
    PopoutsModule.ClosePopout("file-drag");
  }
  fileDrop(file: File) {
    PopoutsModule.ClosePopout("file-drag");
    FileUploadModule.SetFile(file);
  }

  onScroll(event: { target: Element }) {
    // max distance to scroll to bottom when new messsages loaded
    const maxDistance = 22;
    const currentPos = event.target.scrollTop + event.target.clientHeight;
    const scrollHeight = event.target.scrollHeight;
    const currentPxFromBottom = scrollHeight - currentPos;
    const isBottom = currentPxFromBottom <= maxDistance;
    if (this.isScrolledDown !== isBottom) {
      ScrollModule.SetScrolledBottom(isBottom);
    }
  }

  scrollDown(ifScrolledDown = false) {
    if (ifScrolledDown && !this.isScrolledDown) return;
    const element = this.$refs.logs as Element;
    element.scrollTop = element.scrollHeight;
  }
  dismissNotification() {
    if (!this.windowIsFocused || !this.isScrolledDown) return;
    if (!(this.hasServerNotification || this.hasDMNotification)) return;
    this.$socket.client.emit("notification:dismiss", {
      channelID: this.$route.params.channel_id
    });
  }
  @Watch("channelMessages")
  onMessageChanges() {
    if (this.isScrolledDown) {
      this.dismissNotification();
      this.$nextTick(() => {
        this.scrollDown();
      });
    }
  }
  @Watch("windowSize")
  onWindowSizeChange() {
    if (this.isScrolledDown) {
      this.scrollDown();
    }
  }
  @Watch("uploadQueue")
  onUploadQueueChange() {
    this.$nextTick(() => {
      this.scrollDown(true);
    });
  }

  get messageType() {
    return (message: any) =>
      message.type === 0 ? "MessageTemplate" : "ActionMessageTemplate";
  }
  get hasServerNotification() {
    return LastSeenServerChannelsModule.serverChannelNotification(
      this.$route.params.channel_id
    );
  }
  get hasDMNotification() {
    return NotificationsModule.notificationByChannelID(
      this.$route.params.channel_id
    );
  }
  get windowIsFocused() {
    return windowProperties.isFocused;
  }
  get channelMessages() {
    return MessagesModule.groupedChannelMessages(this.$route.params.channel_id);
  }
  get isScrolledDown() {
    return ScrollModule.isScrolledBottom;
  }
  get windowSize() {
    return {
      height: windowProperties.resizeHeight,
      width: windowProperties.resizeWidth
    };
  }
  get uploadQueue() {
    return FileUploadModule.uploadQueue;
  }
}
</script>

<style lang="scss" scoped>
.message-enter-active {
  transition: all 0.5s;
}
.message-enter {
  opacity: 0;
  transform: translateX(-30px);
}

.message-logs {
  display: flex;
  height: 100%;
  flex-direction: column;
  // overflow: auto;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
