<template>
  <div class="typing-status-box" v-if="showTyping">
    <div class="animate-container">
      <div class="dot" />
      <div class="text" v-html="formatedRecipients" />
    </div>
  </div>
</template>

<script lang="ts">
import Message from "@/interfaces/Message";
import { USER_TYPING } from "@/ServerEventNames";
import { MeModule } from "@/store/modules/me";
import { emitter } from "@/utils/globalBus";

interface TypingData {
  channel_id: string;
  user: {
    id: string;
    username: string;
  };
}
interface TypingObj {
  [key: string]: {
    [key: string]: {
      timer?: number | null;
      username: string;
    };
  };
}

import { defineComponent } from "vue";
export default defineComponent({
  name: "MainApp",
  data() {
    return {
      typingObj: {} as TypingObj,
    };
  },
  computed: {
    channelId(): any {
      return this.$route.params.channel_id;
    },
    formatedRecipients(): any {
      const arr = Object.values(this.typingObj[this.channelId]);
      if (!arr.length) return null;
      switch (true) {
        case arr.length == 1:
          return this.$t("typing-status.is-typing", [
            this.makeStrong(arr[0].username),
          ]);
        case arr.length == 2:
          return this.$t("typing-status.two-are-typing", [
            this.makeStrong(arr[0].username),
            this.makeStrong(arr[1].username),
          ]);
        case arr.length == 3:
          return this.$t("typing-status.three-are-typing", [
            this.makeStrong(arr[0].username),
            this.makeStrong(arr[1].username),
            this.makeStrong(arr[2].username),
          ]);
        case arr.length > 3:
          return this.$t("typing-status.more-than-three", [
            this.makeStrong(arr.length.toString()),
          ]);
        default:
          break;
      }
      return arr;
    },
    showTyping(): any {
      return (
        this.typingObj[this.channelId] &&
        Object.values(this.typingObj[this.channelId]).length
      );
    },
  },
  mounted() {
    this.$socket.on(USER_TYPING, this.onTyping);
    emitter.on("newMessage", this.onNewMessage);
  },
  beforeUnmount() {
    this.$socket.off(USER_TYPING, this.onTyping);
    emitter.off("newMessage", this.onNewMessage);
  },
  methods: {
    escapeHtml(unsafe: string) {
      return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    },
    onTyping(data: TypingData) {
      if (data.user.id === MeModule.user.id) return;
      if (data.channel_id !== this.channelId) return;
      const isTyping = this.typingObj[data.channel_id]?.[data.user.id];
      if (isTyping?.timer) {
        clearTimeout(isTyping.timer);
      }
      if (!this.typingObj[data.channel_id]) {
        this.typingObj[data.channel_id] = {
          [data.user.id]: {
            username: data.user.username,
          },
        };
      }
      this.typingObj[data.channel_id][data.user.id] = {
        username: data.user.username,
        timer: window.setTimeout(
          () => this.timeout(data.channel_id, data.user.id),
          3500
        ),
      };
    },
    timeout(channelId: string, id: string) {
      delete this.typingObj[channelId][id];
    },
    onNewMessage(message: Message) {
      const objExists = this.typingObj[message.channelId]?.[message.creator.id];
      if (objExists) {
        objExists.timer && clearTimeout(objExists.timer);
        delete this.typingObj[message.channelId][message.creator.id];
      }
    },
    makeStrong(text: string) {
      return `<strong>${text}</strong>`;
    },
  },
});
</script>

<style lang="scss" scoped>
.typing-status-box {
  display: flex;
  align-items: center;
  background: var(--typing-status-bg-color);
  position: absolute;
  height: 20px;
  right: 0;
  top: -20px;
  left: 0px;
  z-index: 999999999;
  overflow: hidden;
}
.dot {
  height: 10px;
  width: 10px;
  background: white;
  border-radius: 50%;
  margin: 5px;
  animation: dotAnim 0.5s;
  animation-iteration-count: infinite;
  animation-fill-mode: both;
  animation-direction: alternate;
  flex-shrink: 0;
}

@keyframes dotAnim {
  from {
    opacity: 0.7;
  }
  to {
    opacity: 1;
  }
}
.animate-container {
  display: flex;
  align-items: center;
  opacity: 0;
  animation: showUp 0.2s;
  overflow: hidden;
  animation-fill-mode: forwards;
}
.text {
  font-size: 12px;
  opacity: 0.7;
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
