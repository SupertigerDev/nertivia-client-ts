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
import { MeModule } from "@/store/modules/me";
import { eventBus } from "@/utils/globalBus";
import { Component, Vue, Watch } from "vue-property-decorator";

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
      timer: number | null;
      username: string;
    };
  };
}
@Component
export default class MainApp extends Vue {
  typingObj: TypingObj = {};
  mounted() {
    this.$socket.client.on("typingStatus", this.onTyping);
    eventBus.$on("newMessage", this.onNewMessage);
  }
  beforeDestroy() {
    this.$socket.client.off("typingStatus", this.onTyping);
    eventBus.$off("newMessage", this.onNewMessage);
  }

  escapeHtml(unsafe: string) {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
  onTyping(data: TypingData) {
    if (data.user.id === MeModule.user.id) return;
    if (data.channel_id !== this.channelID) return;
    const isTyping = this.typingObj[data.channel_id]?.[data.user.id];
    if (isTyping?.timer) {
      clearTimeout(isTyping.timer);
    }
    if (!this.typingObj[data.channel_id]) {
      this.$set(this.typingObj, data.channel_id, {
        [data.user.id]: {
          username: data.user.username
        }
      });
    }

    this.$set(this.typingObj[data.channel_id], data.user.id, {
      username: data.user.username,
      timer: setTimeout(() => this.timeout(data.channel_id, data.user.id), 3500)
    });
  }
  timeout(channelID: string, id: string) {
    this.$delete(this.typingObj[channelID], id);
  }
  onNewMessage(message: Message) {
    const objExists = this.typingObj[message.channelID]?.[message.creator.id];
    if (objExists) {
      objExists.timer && clearTimeout(objExists.timer);
      this.$delete(this.typingObj[message.channelID], message.creator.id);
    }
  }
  makeStrong(text: string) {
    return `<strong>${text}</strong>`;
  }

  get channelID() {
    return this.$route.params.channel_id;
  }
  get formatedRecipients() {
    const arr = Object.values(this.typingObj[this.channelID]);
    if (!arr.length) return null;
    switch (true) {
      case arr.length == 1:
        return this.$t("typing-status.is-typing", [
          this.makeStrong(arr[0].username)
        ]);
      case arr.length == 2:
        return this.$t("typing-status.two-are-typing", [
          this.makeStrong(arr[0].username),
          this.makeStrong(arr[1].username)
        ]);
      case arr.length == 3:
        return this.$t("typing-status.three-are-typing", [
          this.makeStrong(arr[0].username),
          this.makeStrong(arr[1].username),
          this.makeStrong(arr[3].username)
        ]);
      case arr.length > 3:
        return this.$t("typing-status.more-than-three", [
          this.makeStrong(arr.length.toString())
        ]);
      default:
        break;
    }
    return arr;
  }
  get showTyping() {
    return (
      this.typingObj[this.channelID] &&
      Object.values(this.typingObj[this.channelID]).length
    );
  }
}
</script>

<style lang="scss" scoped>
.typing-status-box {
  display: flex;
  align-items: center;
  background: #1a1a1df6;
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
