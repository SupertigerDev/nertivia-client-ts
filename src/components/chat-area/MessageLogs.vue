<template>
  <div class="message-logs" ref="logs" @scroll.passive="onScroll">
    <transition-group :name="windowIsFocused ? 'message' : ''" tag="p">
      <component
        v-bind:is="messageType(message)"
        class="message"
        @click.native="messageClicked"
        @show-options="showMessageOptions = message"
        :showOptions="showMessageOptions === message"
        v-for="message in channelMessages"
        :key="message.tempID || message.messageID"
        :message="message"
      />
    </transition-group>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { MessagesModule } from "@/store/modules/messages";
import MessageTemplate from "./message/MessageTemplate.vue";
import ActionMessageTemplate from "./message/ActionMessageTemplate.vue";
import { ScrollModule } from "@/store/modules/scroll";
import windowProperties from "@/utils/windowProperties";
import { NotificationsModule } from "@/store/modules/notifications";
import { LastSeenServerChannelsModule } from "@/store/modules/lastSeenServerChannel";
import Message from "@/interfaces/Message";

@Component({ components: { MessageTemplate, ActionMessageTemplate } })
export default class MessageLogs extends Vue {
  showMessageOptions: Message | null = null;
  mounted() {
    ScrollModule.SetScrolledBottom(true);
    this.scrollDown();
  }

  messageClicked() {
    this.showMessageOptions = null;
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

  scrollDown() {
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
}
</script>

<style lang="scss" scoped>
.message-enter-active,
.message-leave-active {
  transition: all 0.5s;
}
.message-enter, .message-leave-to /* .message-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateX(-30px);
}

.message-logs {
  display: flex;
  height: 100%;
  flex-direction: column;
  overflow: auto;
}
</style>
