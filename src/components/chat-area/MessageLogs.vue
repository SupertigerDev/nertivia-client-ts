<template>
  <div
    class="message-logs"
    id="messageLogs"
    ref="logs"
    @scroll.passive="onScroll"
  >
    <Messages
      :animateMessage="messageTransition"
      key="messages"
      :channelId="channelId"
    />
    <transition name="upload-queue" tag="div">
      <UploadQueueComponent v-if="uploadQueue.length" key="upload-queue" />
    </transition>
  </div>
</template>

<script lang="ts">
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
      scrollBottom: 0,
    };
  },
  created() {
    this.currentChannelID = this.channelId;
  },
  mounted() {
    const scrollTop = MessageLogStatesModule.scrollTop(this.channelId);
    if (scrollTop === undefined) {
      MessageLogStatesModule.UpdateState({
        channelId: this.channelId,
        state: {
          isScrolledDown: true,
        },
      });
      this.scrollDown();
    } else {
      this.scrollTop = scrollTop;
      this.moreBottomToLoad =
        MessageLogStatesModule.isBottomUnloaded(this.channelId) || false;
      (this.$refs.logs as Element).scrollTop = scrollTop;
    }

    this.fileDragDropHandler = new FileDragDrop();
    this.fileDragDropHandler.onDragEnter(this.fileDragEnter);
    this.fileDragDropHandler.onDrop(this.fileDrop);
    this.fileDragDropHandler.onDragOut(this.fileDragOut);
    this.dismissNotification();
    emitter.on("scrollToMessage", this.goToMessage);
    emitter.on("bulkDeleteMessages", this.onBulkDelete);
  },
  beforeUnmount() {
    const isScrolledDown = MessageLogStatesModule.isScrolledDown(
      this.currentChannelID
    );
    MessageLogStatesModule.UpdateState({
      channelId: this.currentChannelID,
      state: {
        scrollPosition: isScrolledDown ? undefined : this.scrollTop,
      },
    });
    this.fileDragDropHandler?.destroy();
    emitter.off("scrollToMessage", this.goToMessage);
    emitter.off("bulkDeleteMessages", this.onBulkDelete);
  },
  methods: {
    onBulkDelete() {
      if (!this.channelMessages?.length) return;
      this.moreTopToLoad = true;
      this.moreBottomToLoad = true;
      setTimeout(() => {
        this.loadMoreBottom(true);
        setTimeout(() => {
          this.loadMoreTop(true);
        }, 1000);
      }, 1000);
    },
    fileDragEnter() {
      PopoutsModule.ShowPopout({
        id: "file-drag",
        component: "Drag-drop-popout",
      });
    },
    fileDragOut() {
      PopoutsModule.ClosePopout("file-drag");
    },
    fileDrop(file: File) {
      PopoutsModule.ClosePopout("file-drag");
      FileUploadModule.SetFile(file);
    },
    loadMoreTop(forced = false) {
      if (!this.channelMessages) return;
      if (!forced && this.channelMessages.length <= 40) return;
      if (!this.moreTopToLoad) return;
      const logs: Element = this.$refs.logs as any;
      if (this.isLoadingTopMore) return;
      this.isLoadingTopMore = true;
      this.moreBottomToLoad = true;
      MessagesModule.continueLoadMessages(this.channelId).then(
        async (messages) => {
          if (!this.channelMessages) return;
          if (!messages) return;
          if (!messages.length) {
            this.moreTopToLoad = false;
            return;
          }
          const clamped = await MessagesModule.ClampChannelMessages({
            channelId: this.channelId,
            reverseClamp: true,
            checkScrolledBottom: false,
          });
          if (clamped) {
            MessageLogStatesModule.UpdateState({
              channelId: this.currentChannelID,
              state: {
                bottomUnloaded: true,
              },
            });
          }
          MessagesModule.SetChannelMessages({
            channelId: this.channelId,
            messages: [...messages.reverse(), ...this.channelMessages],
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
    loadMoreBottom(forced = false) {
      if (!this.channelMessages) return;
      if (!forced && this.channelMessages.length <= 40) return;
      if (!this.moreBottomToLoad) return;
      const logs: Element = this.$refs.logs as any;
      if (this.isLoadingBottomMore) return;
      this.isLoadingBottomMore = true;
      this.moreTopToLoad = true;
      MessagesModule.beforeLoadMessages(this.channelId).then((messages) => {
        let dontContinue = false;
        if (!this.channelMessages) dontContinue = true;
        if (!messages) dontContinue = true;

        if (!messages?.length || messages?.length < 50) {
          MessageLogStatesModule.UpdateState({
            channelId: this.currentChannelID,
            state: {
              bottomUnloaded: false,
            },
          });
          this.moreBottomToLoad = false;
          !messages?.length && (dontContinue = true);
        }
        if (dontContinue || !messages) {
          this.isLoadingBottomMore = false;
          return;
        }
        MessagesModule.ClampChannelMessages({
          channelId: this.channelId,
          checkScrolledBottom: false,
        });
        MessagesModule.SetChannelMessages({
          channelId: this.channelId,
          messages: [...(this.channelMessages as any), ...messages],
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
          channelId: this.channelId,
          state: {
            isScrolledDown: isBottom,
          },
        });
      }
    },
    scrollDown(ifScrolledDown = false) {
      if (ifScrolledDown && !this.isScrolledDown) return;
      const element = this.$refs.logs as Element;
      if (!element) return;
      element.scrollTop = element.scrollHeight;
    },
    dismissNotification() {
      if (!this.windowIsFocused || !this.isScrolledDown) return;
      if (!(this.hasServerNotification || this.hasDMNotification)) return;
      this.$socket.emit("notification:dismiss", {
        channelId: this.channelId,
      });
    },
    goToMessage(messageID: string) {
      let message = document.getElementById("message-" + messageID);

      if (message) {
        this.scrollIntoView(message);
        this.highlightMessage(message);
        return;
      }
      fetchMessagesAround(this.channelId, messageID).then(
        ({ channelId, messages }) => {
          MessageLogStatesModule.UpdateState({
            channelId: this.currentChannelID,
            state: {
              bottomUnloaded: true,
            },
          });
          MessagesModule.SetChannelMessages({
            channelId,
            messages: messages.reverse(),
          });

          // stinky solution but oh well. for some reason it always scrolls down
          // without this mess.
          this.$nextTick(() => {
            this.$nextTick(() => {
              window.setTimeout(() => {
                message = document.getElementById("message-" + messageID);
                if (!message) return;

                const intersectionObserver = new IntersectionObserver(
                  (entries) => {
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
        inline: "center",
      });
    },
    highlightMessage(message: HTMLElement) {
      if (message.classList.contains("highlight")) return;
      message.classList.add("highlight");
      window.setTimeout(() => {
        message.classList.remove("highlight");
      }, 3000);
    },
  },
  watch: {
    channelMessages: {
      deep: true,
      handler() {
        if (this.isScrolledDown) {
          this.dismissNotification();
          this.$nextTick(() => {
            this.scrollDown();
          });
        }
      },
    },
    windowSize() {
      if (this.isScrolledDown) {
        this.scrollDown();
      }
    },
    uploadQueue: {
      deep: true,
      handler() {
        this.$nextTick(() => {
          this.scrollDown(true);
        });
      },
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
    },
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

    hasServerNotification(): any {
      return LastSeenServerChannelsModule.serverChannelNotification(
        this.channelId
      );
    },
    hasDMNotification(): Notification {
      return NotificationsModule.notificationByChannelID(this.channelId);
    },
    windowIsFocused(): boolean {
      return useWindowProperties().isFocused;
    },
    channelMessages(): Message[] | undefined {
      return MessagesModule.messages[this.channelId];
    },
    channelId(): string {
      return this.$route.params.channel_id as string;
    },
    isScrolledDown(): boolean {
      return MessageLogStatesModule.isScrolledDown(this.channelId);
    },
    windowSize(): { height: number; width: number } {
      const { resizeWidth, resizeHeight } = useWindowProperties();
      return {
        height: resizeHeight,
        width: resizeWidth,
      };
    },
    uploadQueue(): UploadQueue[] {
      return FileUploadModule.uploadQueue;
    },
  },
});
</script>

<style lang="scss" scoped>
.upload-queue-enter-active {
  transition: all 0.5s;
}
.upload-queue-enter-from {
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
