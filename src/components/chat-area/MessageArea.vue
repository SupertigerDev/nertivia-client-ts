<template>
  <div class="message-area">
    <Header :title="channel && channel.name" v-if="isServerChannel" />
    <Header
      :title="DMChannel && DMChannel.recipients[0].username"
      v-else-if="DMChannel && DMChannel.recipients"
    />
    <div class="loading" v-if="!channelMessages">Loading...</div>
    <MessageLogs :key="channelID" v-else />
    <MessageBoxArea />
  </div>
</template>

<script lang="ts">
import Header from "@/components/Header.vue";
import { Component, Vue, Watch } from "vue-property-decorator";
import { MessagesModule } from "@/store/modules/messages";
import MessageLogs from "./MessageLogs.vue";
import MessageBoxArea from "./MessageBoxArea.vue";
import { ChannelsModule } from "@/store/modules/channels";
import windowProperties from "@/utils/windowProperties";
import { NotificationsModule } from "@/store/modules/notifications";
import { LastSeenServerChannelsModule } from "@/store/modules/lastSeenServerChannel";

@Component({ components: { MessageLogs, MessageBoxArea, Header } })
export default class MessageArea extends Vue {
  mounted() {
    this.loadChannelMessages();
    this.dismissNotification();
  }
  @Watch("channelID")
  channalChaned() {
    this.loadChannelMessages();
    this.dismissNotification();
  }
  loadChannelMessages() {
    if (this.channelMessages) return;
    if (!this.channelID) return;
    MessagesModule.FetchAndSetMessages(this.channelID);
  }
  get isFocused() {
    return windowProperties.isFocused;
  }
  dismissNotification() {
    if (!this.isFocused) return;
    if (!(this.hasServerNotification || this.hasDMNotification)) return;
    this.$socket.client.emit("notification:dismiss", {
      channelID: this.channelID
    });
  }
  get hasServerNotification() {
    return LastSeenServerChannelsModule.serverChannelNotification(
      this.channelID
    );
  }
  get hasDMNotification() {
    return NotificationsModule.notificationByChannelID(this.channelID);
  }
  get channelMessages() {
    return MessagesModule.channelMessages(this.channelID);
  }
  get channelID() {
    return this.$route.params.channel_id;
  }
  get isServerChannel() {
    return this.$route.params.server_id;
  }
  get channel() {
    return ChannelsModule.channels[this.channelID];
  }
  get DMChannel() {
    return ChannelsModule.getDMChannel(this.channelID);
  }
}
</script>

<style lang="scss" scoped>
.message-area {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}
.loading {
  height: 100%;
}
</style>
