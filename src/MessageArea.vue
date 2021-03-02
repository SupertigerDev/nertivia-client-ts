<template>
  <div class="message-area">
    <Header :title="channel && channel.name" v-if="isServerChannel" />
    <Header
      :title="DMChannel && DMChannel.recipients[0].username"
      v-else-if="DMChannel && DMChannel.recipients"
    />
    <LoadingScreen v-if="!channelMessages" />
    <MessageLogs :key="channelID" v-else />
    <MessageBoxArea />
  </div>
</template>

<script lang="ts">
import Header from "@/components/Header.vue";
import { Component, Vue, Watch } from "vue-property-decorator";
import { MessagesModule } from "@/store/modules/messages";
import MessageLogs from "./MessageLogs.vue";
import LoadingScreen from "@/components/LoadingScreen.vue";
import MessageBoxArea from "./MessageBoxArea.vue";
import { ChannelsModule } from "@/store/modules/channels";
import windowProperties from "@/utils/windowProperties";
import { NotificationsModule } from "@/store/modules/notifications";
import { LastSeenServerChannelsModule } from "@/store/modules/lastSeenServerChannel";
import { MeModule } from "@/store/modules/me";
import { ScrollModule } from "@/store/modules/scroll";
import { botCommandsModule } from "@/store/modules/botCommands";

@Component({
  components: { MessageLogs, MessageBoxArea, Header, LoadingScreen }
})
export default class MessageArea extends Vue {
  loadCommands() {
    if (this.serverID && !botCommandsModule.serverBotCommands[this.serverID]) {
      botCommandsModule.FetchAndSetBotCommands({ serverId: this.serverID });
    } else if (this.DMChannel?.recipients?.[0].bot) {
      botCommandsModule.FetchAndSetBotCommands({
        botIDArr: [this.DMChannel.recipients[0].uniqueID]
      });
    }
  }
  loadChannelMessages() {
    if (!this.channel) return;
    if (!this.isConnected) return;
    if (this.channelMessages) return;
    if (!this.channelID) return;
    MessagesModule.FetchAndSetMessages(this.channelID);
    this.loadCommands();
  }
  dismissNotification() {
    if (!ScrollModule.isScrolledBottom) return;
    if (!this.isConnected) return;
    if (!this.isFocused) return;
    if (!(this.hasServerNotification || this.hasDMNotification)) return;
    this.$socket.client.emit("notification:dismiss", {
      channelID: this.channelID
    });
  }

  mounted() {
    this.dismissNotification();
    this.loadChannelMessages();
  }
  @Watch("isConnected")
  onConnected() {
    this.loadChannelMessages();
  }
  @Watch("channelID")
  channalChanged() {
    this.loadChannelMessages();
    this.dismissNotification();
  }
  @Watch("isFocused")
  onFocusChange() {
    this.dismissNotification();
  }
  get isFocused() {
    return windowProperties.isFocused;
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
  get isConnected() {
    return MeModule.connected;
  }

  get serverID() {
    if (this.currentTab !== "servers") return undefined;
    return this.$route.params.server_id;
  }
  get currentTab() {
    return this.$route.path.split("/")[2] || "";
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
