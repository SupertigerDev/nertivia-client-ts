<template>
  <div class="background">
    <div
      class="button animate-in"
      :class="{ alert: hasNotification }"
      @click="ScrollDown"
    >
      <div class="material-icons icon">arrow_downward</div>
      {{
        hasNotification
          ? $t("message-area.new-messages")
          : $t("message-area.back-to-bottom")
      }}
    </div>
  </div>
</template>

<script lang="ts">
import { fetchMessages } from "@/services/messagesService";
import { LastSeenServerChannelsModule } from "@/store/modules/lastSeenServerChannel";
import { MessageLogStatesModule } from "@/store/modules/messageLogStates";
import { MessagesModule } from "@/store/modules/messages";

import { defineComponent } from "vue";
export default defineComponent({
  name: "ScrollDownButton",
  computed: {
    hasNotification(): any {
      return LastSeenServerChannelsModule.serverChannelNotification(
        this.channelId
      );
    },
    channelId(): any {
      return this.$route.params.channel_id;
    },
  },
  methods: {
    ScrollDown() {
      const messageLogs = document.getElementById("messageLogs");
      if (!messageLogs) return;
      if (!MessageLogStatesModule.isBottomUnloaded(this.channelId)) {
        document.getElementById("messageLogs")?.scrollTo({
          behavior: "smooth",
          top: messageLogs.scrollHeight,
        });
        this.resetState();
        return;
      }
      // MessagesModule.SetChannelMessages({
      //   channelId: this.channelId,
      //   messages: null
      // });

      fetchMessages(this.channelId).then((json) => {
        MessagesModule.SetChannelMessages({
          channelId: this.channelId,
          messages: json.messages.reverse(),
        });
        this.$nextTick(() => {
          this.$nextTick(() => {
            document.getElementById("messageLogs")?.scrollTo({
              behavior: "smooth",
              top: messageLogs.scrollHeight,
            });
            this.resetState();
          });
        });
      });
    },
    resetState() {
      MessageLogStatesModule.UpdateState({
        channelId: this.channelId,
        state: {
          isScrolledDown: true,
          bottomUnloaded: undefined,
          scrollPosition: undefined,
        },
      });
    },
  },
});
</script>

<style lang="scss" scoped>
.background {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  height: 70px;
  right: 0;
  top: -80px;
  left: 0px;
  pointer-events: none;
  z-index: 999999999;
  overflow: hidden;
}
.button {
  display: flex;
  align-items: center;
  align-content: center;
  border-radius: 20px;
  background: var(--primary-color);
  cursor: pointer;
  user-select: none;
  font-size: 14px;
  padding: 10px;
  padding-top: 5px;
  padding-bottom: 5px;
  pointer-events: all;
  transition: 0.2s;
  box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.7);
  &.alert {
    background: var(--alert-color);
  }
  &:hover {
    opacity: 0.7;
  }
  .icon {
    margin-right: 5px;
  }
}

.animate-in {
  opacity: 0;
  animation: showUp 0.2s;
  animation-fill-mode: forwards;
}
@keyframes showUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
