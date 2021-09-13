<template>
  <div
    class="message-logs"
    id="messageLogs"
    ref="logs"
    @scroll.passive="onScroll"
  >
    <!-- <transition-group :name="messageTransition ? 'message' : ''" tag="div"> -->
    <Messages key="messages" :channelID="channelID" class="message" />
    <UploadQueueComponent v-if="uploadQueue.length" key="upload-queue" />
    <!-- </transition-group> -->
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { MessagesModule } from "@/store/modules/messages";
import Messages from "./Messages.vue";
import UploadQueueComponent from "./message/UploadQueue.vue";
import { useWindowProperties } from "@/utils/windowProperties";
import { NotificationsModule } from "@/store/modules/notifications";
import { LastSeenServerChannelsModule } from "@/store/modules/lastSeenServerChannel";
import FileDragDrop from "@/utils/FileDragDrop";
import { FileUploadModule, UploadQueue } from "@/store/modules/fileUpload";
import { PopoutsModule } from "@/store/modules/popouts";
import Message from "@/interfaces/Message";
import { emitter } from "@/utils/globalBus";
import { fetchMessagesAround } from "@/services/messagesService";
import { MessageLogStatesModule } from "@/store/modules/messageLogStates";
import Notification from "@/interfaces/Notification";
import { defineComponent } from "vue";
export default defineComponent({
  components: { UploadQueueComponent, Messages },
  data() {
    return {
      fileDragDropHandler: undefined as FileDragDrop | undefined,
      isLoadingTopMore: false,
      isLoadingBottomMore: false,
      moreTopToLoad: true,
      moreBottomToLoad: false,
      currentChannelID: "",
      scrollTop: 0,
      scrollBottom: 0
    };
  },
  created() {
    this.currentChannelID = this.channelID;
  },
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
    emitter.on("scrollToMessage", this.goToMessage);
  },
  beforeUnmount() {
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
    emitter.off("scrollToMessage", this.goToMessage);
  },
  methods: {
    fileDragEnter() {
      PopoutsModule.ShowPopout({
        id: "file-drag",
        component: "Drag-drop-popout"
      });
    },
    fileDragOut() {
      PopoutsModule.ClosePopout("file-drag");
    },
    fileDrop(file: File) {
      PopoutsModule.ClosePopout("file-drag");
      FileUploadModule.SetFile(file);
    },
    loadMoreTop() {
      if (!this.channelMessages) return;
      if (this.channelMessages.length <= 40) return;
      if (!this.moreTopToLoad) return;
      const logs: Element = this.$refs.logs as any;
      if (this.isLoadingTopMore) return;
      this.isLoadingTopMore = true;
      this.moreBottomToLoad = true;
      MessagesModule.continueLoadMessages(this.channelID).then(
        async messages => {
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
              logs.scrollTop =
                logs.scrollHeight - beforeHeight + beforeScrollTop;
              window.setTimeout(() => {
                this.isLoadingTopMore = false;
                if (this.scrolledToEnd.isTop) {
                  this.loadMoreTop();
                }
              }, 1000);
            });
          });
        }
      );
    },
    loadMoreBottom() {
      if (!this.channelMessages) return;
      if (this.channelMessages.length <= 40) return;
      if (!this.moreBottomToLoad) return;
      const logs: Element = this.$refs.logs as any;
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
            window.setTimeout(() => {
              this.isLoadingBottomMore = false;
              if (this.scrolledToEnd.isBottom) {
                this.loadMoreBottom();
              }
            }, 1000);
          });
        });
      });
    },

    onScroll(event: any) {
      this.scrollTop = event.target.scrollTop;
      // max distance to scroll to bottom when new messsages loaded
      const maxDistance = 22;
      const currentPos = event.target.scrollTop + event.target.clientHeight;
      const scrollHeight = event.target.scrollHeight;

      this.scrollBottom = scrollHeight - currentPos;

      const isBottom = this.scrollBottom <= maxDistance;
      if (this.isScrolledDown !== isBottom) {
        MessageLogStatesModule.UpdateState({
          channelID: this.channelID,
          state: {
            isScrolledDown: isBottom
          }
        });
      }
    },
    scrollDown(ifScrolledDown = false) {
      if (ifScrolledDown && !this.isScrolledDown) return;
      const element = this.$refs.logs as Element;
      element.scrollTop = element.scrollHeight;
    },
    dismissNotification() {
      if (!this.windowIsFocused || !this.isScrolledDown) return;
      if (!(this.hasServerNotification || this.hasDMNotification)) return;
      this.$socket.emit("notification:dismiss", {
        channelID: this.channelID
      });
    },
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
              window.setTimeout(() => {
                message = document.getElementById("message-" + messageID);
                if (!message) return;

                const intersectionObserver = new IntersectionObserver(
                  entries => {
                    const [entry] = entries;
                    if (entry.isIntersecting) {
                      window.setTimeout(() => {
                        intersectionObserver.disconnect();
                        this.moreTopToLoad = true;
                        this.moreBottomToLoad = true;
                      }, 100);
                    }
                  }
                );
                intersectionObserver.observe(message);
                window.setTimeout(() => {
                  intersectionObserver.disconnect();
                }, 2000);

                this.scrollIntoView(message);
                this.highlightMessage(message);
              }, 500);
            });
          });
        }
      );
    },
    scrollIntoView(message: HTMLElement) {
      message.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center"
      });
    },
    highlightMessage(message: HTMLElement) {
      if (message.classList.contains("highlight")) return;
      message.classList.add("highlight");
      window.setTimeout(() => {
        message.classList.remove("highlight");
      }, 3000);
    }
  },
  watch: {
    channelMessages() {
      if (this.isScrolledDown) {
        this.dismissNotification();
        this.$nextTick(() => {
          this.scrollDown();
        });
      }
    },
    windowSize() {
      if (this.isScrolledDown) {
        this.scrollDown();
      }
    },
    uploadQueue() {
      this.$nextTick(() => {
        this.scrollDown(true);
      });
    },
    isScrolledDown() {
      this.dismissNotification();
    },
    scrolledToEnd(status: { isTop: boolean; isBottom: boolean }) {
      if (!this.channelMessages) return;
      if (this.channelMessages.length <= 40) return;
      if (status.isTop) {
        this.loadMoreTop();
      }
      if (status.isBottom) {
        this.loadMoreBottom();
      }
    }
  },
  computed: {
    // used for loading more.
    scrolledToEnd(): { isTop: boolean; isBottom: boolean } {
      const distance = 400;
      const isTop = this.scrollTop <= distance;
      const isBottom = this.scrollBottom <= distance;
      return { isTop, isBottom };
    },

    messageTransition(): boolean {
      if (!this.windowIsFocused) return false;
      if (this.isLoadingTopMore) return false;
      return !this.isLoadingBottomMore;
    },
    messageType(): any {
      return (message: any): string =>
        message.type === 0 ? "MessageTemplate" : "ActionMessageTemplate";
    },
    hasServerNotification(): any {
      return LastSeenServerChannelsModule.serverChannelNotification(
        this.channelID
      );
    },
    hasDMNotification(): Notification {
      return NotificationsModule.notificationByChannelID(this.channelID);
    },
    windowIsFocused(): boolean {
      return useWindowProperties().isFocused;
    },
    channelMessages(): Message[] | undefined {
      return MessagesModule.messages[this.channelID];
    },
    channelID(): string {
      return this.$route.params.channel_id as string;
    },
    isScrolledDown(): boolean {
      return MessageLogStatesModule.isScrolledDown(this.channelID);
    },
    windowSize(): { height: number; width: number } {
      const { resizeWidth, resizeHeight } = useWindowProperties();
      return {
        height: resizeHeight,
        width: resizeWidth
      };
    },
    uploadQueue(): UploadQueue[] {
      return FileUploadModule.uploadQueue;
    }
  }
});
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

.highlight {
  background: rgba(0, 0, 0, 0.4);
  border-radius: 4px;
}
</style>
