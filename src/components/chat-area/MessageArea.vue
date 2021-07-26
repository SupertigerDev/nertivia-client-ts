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
import { botCommandsModule } from "@/store/modules/botCommands";
import { MessageLogStatesModule } from "@/store/modules/messageLogStates";
import { TabsModule } from "@/store/modules/tabs";
import { ServersModule } from "@/store/modules/servers";

@Component({
  components: { MessageLogs, MessageBoxArea, Header, LoadingScreen },
})
export default class MessageArea extends Vue {
  loadCommands() {
    if (this.serverID && !botCommandsModule.serverBotCommands[this.serverID]) {
      botCommandsModule.FetchAndSetBotCommands({ serverId: this.serverID });
    } else if (this.DMChannel?.recipients?.[0]?.bot) {
      botCommandsModule.FetchAndSetBotCommands({
        botIDArr: [this.DMChannel.recipients[0].id],
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
    if (!MessageLogStatesModule.isScrolledDown(this.channelID)) return;
    if (!this.isConnected) return;
    if (!this.isFocused) return;
    if (!(this.hasServerNotification || this.hasDMNotification)) return;
    this.$socket.client.emit("notification:dismiss", {
      channelID: this.channelID,
    });
  }
  setTitle() {
    if (this.DMChannel) {
      const recipient = this.DMChannel.recipients?.[0];
      if (!recipient) return;
      TabsModule.setCurrentTab({
        name: "@" + recipient.username,
        user_id: recipient.id,
      });
    }
    if (this.server) {
      const serverName = this.server.name;
      const channelName = this.channel.name;
      TabsModule.setCurrentTab({
        name: `${serverName}#${channelName}`,
        server_id: this.serverID,
      });
    }
  }
  mounted() {
    this.dismissNotification();
    this.loadChannelMessages();
    this.setTitle();
  }
  @Watch("isConnected")
  onConnected() {
    this.loadChannelMessages();
  }
  @Watch("channelID")
  channalIDChanged() {
    this.loadChannelMessages();
    this.dismissNotification();
  }
  @Watch("channel")
  channelChanged() {
    this.setTitle();
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
  get server() {
    if (this.serverID) {
      return ServersModule.servers?.[this.serverID];
    } else {
      return undefined;
    }
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
