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
      <Messages :channelID="channelID" class="message" />
      <UploadQueue v-if="uploadQueue.length" key="upload-queue" />
    </transition-group>
    <div class="bottom-observer-outer">
      <Observer
        ref="bottomObserver"
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
import Messages from "./Messages.vue";
import Observer from "./Observer.vue";
import windowProperties from "@/utils/windowProperties";
import { NotificationsModule } from "@/store/modules/notifications";
import { LastSeenServerChannelsModule } from "@/store/modules/lastSeenServerChannel";
import FileDragDrop from "@/utils/FileDragDrop";
import { FileUploadModule } from "@/store/modules/fileUpload";
import { PopoutsModule } from "@/store/modules/popouts";
import Message from "@/interfaces/Message";
import { eventBus } from "@/utils/globalBus";
import { fetchMessagesAround } from "@/services/messagesService";
import { MessageLogStatesModule } from "@/store/modules/messageLogStates";
@Component({
  components: {
    MessageTemplate,
    ActionMessageTemplate,
    UploadQueue,
    Observer,
    Messages
  }
})
export default class MessageLogs extends Vue {
  fileDragDropHandler: FileDragDrop | undefined;

  // when loading more messages above
  isLoadingTopMore = false;
  isLoadingBottomMore = false;
  moreTopToLoad = true;
  moreBottomToLoad = false;
  currentChannelID = this.channelID;
  scrollTop = 0;
  mounted() {
    const scrollTop = MessageLogStatesModule.scrollTop(this.channelID);
    if (scrollTop === undefined) {
      MessageLogStatesModule.UpdateState({
        channelID: this.channelID,
        state: {
          isScrolledDown: true
        }
      });
      this.scrollDown();
    } else {
      this.scrollTop = scrollTop;
      this.moreBottomToLoad =
        MessageLogStatesModule.isBottomUnloaded(this.channelID) || false;
      (this.$refs.logs as Element).scrollTop = scrollTop;
    }

    this.fileDragDropHandler = new FileDragDrop();
    this.fileDragDropHandler.onDragEnter(this.fileDragEnter);
    this.fileDragDropHandler.onDrop(this.fileDrop);
    this.fileDragDropHandler.onDragOut(this.fileDragOut);
    this.dismissNotification();
    eventBus.$on("scrollToMessage", this.goToMessage);
  }
  beforeDestroy() {
    const isScrolledDown = MessageLogStatesModule.isScrolledDown(
      this.currentChannelID
    );
    MessageLogStatesModule.UpdateState({
      channelID: this.currentChannelID,
      state: {
        scrollPosition: isScrolledDown ? undefined : this.scrollTop
      }
    });
    this.fileDragDropHandler?.destroy();
    eventBus.$off("scrollToMessage", this.goToMessage);
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
    if (!this.channelMessages) return;
    if (this.channelMessages.length <= 40) return;
    if (!this.moreTopToLoad) return;
    const logs: Element = this.$refs.logs as any;
    if (!isIntersecting) return;
    if (this.isLoadingTopMore) return;
    this.isLoadingTopMore = true;
    this.moreBottomToLoad = true;
    MessagesModule.continueLoadMessages(this.channelID).then(async messages => {
      if (!this.channelMessages) return;
      if (!messages) return;
      if (!messages.length) {
        this.moreTopToLoad = false;
        return;
      }
      const clamped = await MessagesModule.ClampChannelMessages({
        channelID: this.channelID,
        reverseClamp: true,
        checkScrolledBottom: false
      });
      if (clamped) {
        MessageLogStatesModule.UpdateState({
          channelID: this.currentChannelID,
          state: {
            bottomUnloaded: true
          }
        });
      }
      MessagesModule.SetChannelMessages({
        channelID: this.channelID,
        messages: [...messages.reverse(), ...this.channelMessages]
      });

      const beforeHeight = logs.scrollHeight;
      const beforeScrollTop = logs.scrollTop;

      this.$nextTick(() => {
        this.$nextTick(() => {
          logs.scrollTop = logs.scrollHeight - beforeHeight + beforeScrollTop;
          setTimeout(() => {
            this.isLoadingTopMore = false;
            if ((this.$refs.topObserver as any).intersecting) {
              this.intersectTopChange(true);
            }
          }, 1000);
        });
      });
    });
  }
  intersectBottomChange(isIntersecting: boolean) {
    if (!this.channelMessages) return;
    if (this.channelMessages.length <= 40) return;
    if (!this.moreBottomToLoad) return;
    const logs: Element = this.$refs.logs as any;
    if (!isIntersecting) return;
    if (this.isLoadingBottomMore) return;
    this.isLoadingBottomMore = true;
    this.moreTopToLoad = true;
    MessagesModule.beforeLoadMessages(this.channelID).then(messages => {
      let dontContinue = false;
      if (!this.channelMessages) dontContinue = true;
      if (!messages) dontContinue = true;

      if (!messages?.length || messages?.length < 50) {
        MessageLogStatesModule.UpdateState({
          channelID: this.currentChannelID,
          state: {
            bottomUnloaded: false
          }
        });
        this.moreBottomToLoad = false;
        !messages?.length && (dontContinue = true);
      }
      if (dontContinue || !messages) {
        this.isLoadingBottomMore = false;
        return;
      }
      MessagesModule.ClampChannelMessages({
        channelID: this.channelID,
        checkScrolledBottom: false
      });
      MessagesModule.SetChannelMessages({
        channelID: this.channelID,
        messages: [...(this.channelMessages as any), ...messages]
      });

      const beforeScrollTop = logs.scrollTop;

      this.$nextTick(() => {
        this.$nextTick(() => {
          logs.scrollTop = beforeScrollTop;
          setTimeout(() => {
            this.isLoadingBottomMore = false;
            if ((this.$refs.bottomObserver as any).intersecting) {
              this.intersectBottomChange(true);
            }
          }, 1000);
        });
      });
    });
  }

  onScroll(event: { target: Element }) {
    this.scrollTop = event.target.scrollTop;
    // max distance to scroll to bottom when new messsages loaded
    const maxDistance = 22;
    const currentPos = event.target.scrollTop + event.target.clientHeight;
    const scrollHeight = event.target.scrollHeight;
    const currentPxFromBottom = scrollHeight - currentPos;
    const isBottom = currentPxFromBottom <= maxDistance;
    if (this.isScrolledDown !== isBottom) {
      MessageLogStatesModule.UpdateState({
        channelID: this.channelID,
        state: {
          isScrolledDown: isBottom
        }
      });
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
  goToMessage(messageID: string) {
    let message = document.getElementById("message-" + messageID);

    if (message) {
      this.scrollIntoView(message);
      this.highlightMessage(message);
      return;
    }
    fetchMessagesAround(this.channelID, messageID).then(
      ({ channelID, messages }) => {
        MessageLogStatesModule.UpdateState({
          channelID: this.currentChannelID,
          state: {
            bottomUnloaded: true
          }
        });
        MessagesModule.SetChannelMessages({
          channelID,
          messages: messages.reverse()
        });

        // stinky solution but oh well. for some reason it always scrolls down
        // without this mess.
        this.$nextTick(() => {
          this.$nextTick(() => {
            setTimeout(() => {
              message = document.getElementById("message-" + messageID);
              if (!message) return;
              this.scrollIntoView(message);
              this.highlightMessage(message);
              this.moreTopToLoad = true;
              this.moreBottomToLoad = true;
            }, 500);
          });
        });
      }
    );
  }
  scrollIntoView(message: HTMLElement) {
    message.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center"
    });
  }
  highlightMessage(message: HTMLElement) {
    if (message.classList.contains("highlight")) return;
    message.classList.add("highlight");
    setTimeout(() => {
      message.classList.remove("highlight");
    }, 3000);
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
  @Watch("isScrolledDown")
  onScrolldDown() {
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
  get channelMessages(): Message[] | undefined {
    return MessagesModule.messages[this.channelID];
  }
  get channelID() {
    return this.$route.params.channel_id;
  }
  get isScrolledDown() {
    return MessageLogStatesModule.isScrolledDown(this.channelID);
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
.bottom-observer-outer {
  z-index: -1;
  position: relative;
}
.highlight {
  background: rgba(0, 0, 0, 0.4);
  border-radius: 4px;
}
</style>
