<template>
  <div
    class="message-logs"
    id="messageLogs"
    ref="logs"
    @scroll.passive="onScroll"
  >
    <Observer
      ref="topObserver"
      @intersecting="intersectTopChange"
      class="observe-load-more"
    />
    <transition-group :name="messageTransition ? 'message' : ''" tag="div">
      <component
        v-for="message in channelMessagesGrouped"
        v-bind:is="messageType(message)"
        class="message"
        :key="message.tempID || message.messageID"
        :message="message"
      />
      <UploadQueue v-if="uploadQueue.length" key="upload-queue" />
    </transition-group>
    <div class="test">
      <Observer
        ref="borromObserver"
        @intersecting="intersectBottomChange"
        class="observe-load-more bottom"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { MessagesModule } from "@/store/modules/messages";
import MessageTemplate from "./message/MessageTemplate.vue";
import UploadQueue from "./message/UploadQueue.vue";
import ActionMessageTemplate from "./message/ActionMessageTemplate.vue";
import Observer from "./Observer.vue";
import { ScrollModule } from "@/store/modules/scroll";
import windowProperties from "@/utils/windowProperties";
import { NotificationsModule } from "@/store/modules/notifications";
import { LastSeenServerChannelsModule } from "@/store/modules/lastSeenServerChannel";
import FileDragDrop from "@/utils/FileDragDrop";
import { FileUploadModule } from "@/store/modules/fileUpload";
import { PopoutsModule } from "@/store/modules/popouts";
import Message from "@/interfaces/Message";

@Component({
  components: { MessageTemplate, ActionMessageTemplate, UploadQueue, Observer }
})
export default class MessageLogs extends Vue {
  fileDragDropHandler: FileDragDrop | undefined;

  // when loading more messages above
  isLoadingTopMore = false;
  isLoadingBottomMore = false;
  moreTopToLoad = true;
  mounted() {
    ScrollModule.SetScrolledBottom(true);
    this.scrollDown();
    this.fileDragDropHandler = new FileDragDrop();
    this.fileDragDropHandler.onDragEnter(this.fileDragEnter);
    this.fileDragDropHandler.onDrop(this.fileDrop);
    this.fileDragDropHandler.onDragOut(this.fileDragOut);
    this.dismissNotification();
  }
  beforeDestroy() {
    this.fileDragDropHandler?.destroy();
  }
  fileDragEnter() {
    PopoutsModule.ShowPopout({
      id: "file-drag",
      component: "Drag-drop-popout"
    });
  }
  fileDragOut() {
    PopoutsModule.ClosePopout("file-drag");
  }
  fileDrop(file: File) {
    PopoutsModule.ClosePopout("file-drag");
    FileUploadModule.SetFile(file);
  }
  intersectTopChange(isIntersecting: boolean) {
    if (!this.moreTopToLoad) return;
    const logs: Element = this.$refs.logs as any;
    if (!isIntersecting) return;
    if (this.isLoadingTopMore) return;
    this.isLoadingTopMore = true;
    MessagesModule.continueLoadMessages(this.channelID).then(messages => {
      if (!this.channelMessages) return;
      if (!messages) return;
      if (!messages.length) {
        this.moreTopToLoad = false;
        return;
      }
      if (messages.length < 50) {
        this.moreTopToLoad = false;
      }
      MessagesModule.ClampChannelMessages({
        channelID: this.channelID,
        reverseClamp: true,
        checkScrolledBottom: false
      });

      const beforeHeight = logs.scrollHeight;
      const beforeScrollTop = logs.scrollTop;
      MessagesModule.SetChannelMessages({
        channelID: this.channelID,
        messages: [...messages, ...this.channelMessages]
      });

      this.$nextTick(() => {
        this.$nextTick(() => {
          this.isLoadingTopMore = false;
          logs.scrollTop = logs.scrollHeight - beforeHeight + beforeScrollTop;
        });
      });
    });
  }
  intersectBottomChange(isIntersecting: boolean) {
    // if (!this.moreBottomToLoad) return;

    const logs: Element = this.$refs.logs as any;
    if (!isIntersecting) return;
    if (this.isLoadingBottomMore) return;
    this.isLoadingBottomMore = true;
    MessagesModule.beforeLoadMessages(this.channelID).then(messages => {
      if (!this.channelMessages) return;
      if (!messages) return;
      if (!messages.length) {
        // this.moreBottomToLoad = false;
        // return;
      }
      if (messages.length < 50) {
        // this.moreBottomToLoad = false;
      }
      MessagesModule.ClampChannelMessages({
        channelID: this.channelID,
        checkScrolledBottom: false
      });
      const beforeHeight = logs.scrollHeight;
      const beforeScrollTop = logs.scrollTop;
      MessagesModule.SetChannelMessages({
        channelID: this.channelID,
        messages: [...this.channelMessages, ...messages]
      });
      this.$nextTick(() => {
        this.$nextTick(() => {
          this.isLoadingBottomMore = false;
          logs.scrollTop = beforeScrollTop;
        });
      });
    });
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
      channelID: this.channelID
    });
  }
  @Watch("channelMessagesGrouped")
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
  @Watch("isScrolledDown")
  onScrolldDown(scrolledDown: boolean) {
    this.dismissNotification();
  }
  get messageTransition() {
    if (!this.windowIsFocused) return false;
    if (this.isLoadingTopMore) return false;
    return !this.isLoadingBottomMore;
  }
  get messageType() {
    return (message: any) =>
      message.type === 0 ? "MessageTemplate" : "ActionMessageTemplate";
  }
  get hasServerNotification() {
    return LastSeenServerChannelsModule.serverChannelNotification(
      this.channelID
    );
  }
  get hasDMNotification() {
    return NotificationsModule.notificationByChannelID(this.channelID);
  }
  get windowIsFocused() {
    return windowProperties.isFocused;
  }
  get channelMessagesGrouped() {
    return MessagesModule.groupedChannelMessages(this.channelID);
  }
  get channelMessages(): Message[] | undefined {
    return MessagesModule.messages[this.channelID];
  }
  get channelID() {
    return this.$route.params.channel_id;
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
  position: relative;
  display: flex;
  height: 100%;
  flex-direction: column;
  // overflow: auto;
  overflow-y: auto;
  overflow-x: hidden;
}
.message-logs::after {
  content: "";
  display: block;
  padding-bottom: 20px;
}
.observe-load-more {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 700px;
  &.bottom {
    top: initial;
    bottom: 0;
  }
}
.test {
  z-index: -1;
  position: relative;
}
</style>
