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
import Vue from "vue";
export default Vue.extend({
  name: "MessageArea",
  components: { MessageLogs, MessageBoxArea, Header, LoadingScreen },
  computed: {
    isFocused(): any {
      return windowProperties.isFocused;
    },
    hasServerNotification(): any {
      return LastSeenServerChannelsModule.serverChannelNotification(
        this.channelID
      );
    },
    hasDMNotification(): any {
      return NotificationsModule.notificationByChannelID(this.channelID);
    },
    channelMessages(): any {
      return MessagesModule.channelMessages(this.channelID);
    },
    channelID(): any {
      return this.$route.params.channel_id;
    },
    isServerChannel(): any {
      return this.$route.params.server_id;
    },
    channel(): any {
      return ChannelsModule.channels[this.channelID];
    },
    DMChannel(): any {
      return ChannelsModule.getDMChannel(this.channelID);
    },
    server(): any {
      if (this.serverID) {
        return ServersModule.servers?.[this.serverID];
      } else {
        return undefined;
      }
    },
    isConnected(): any {
      return MeModule.connected;
    },
    serverID(): any {
      if (this.currentTab !== "servers") return undefined;
      return this.$route.params.server_id;
    },
    currentTab(): any {
      return this.$route.path.split("/")[2] || "";
    }
  },
  watch: {
    isConnected: {
      handler: "onConnected"
    },
    channelID: {
      handler: "channalIDChanged"
    },
    channel: {
      handler: "channelChanged"
    },
    isFocused: {
      handler: "onFocusChange"
    }
  },
  mounted() {
    this.dismissNotification();
    this.loadChannelMessages();
    this.setTitle();
  },
  methods: {
    loadCommands() {
      if (
        this.serverID &&
        !botCommandsModule.serverBotCommands[this.serverID]
      ) {
        botCommandsModule.FetchAndSetBotCommands({ serverId: this.serverID });
      } else if (this.DMChannel?.recipients?.[0]?.bot) {
        botCommandsModule.FetchAndSetBotCommands({
          botIDArr: [this.DMChannel.recipients[0].id]
        });
      }
    },
    loadChannelMessages() {
      if (!this.channel) return;
      if (!this.isConnected) return;
      if (this.channelMessages) return;
      if (!this.channelID) return;
      MessagesModule.FetchAndSetMessages(this.channelID);
      this.loadCommands();
    },
    dismissNotification() {
      if (!MessageLogStatesModule.isScrolledDown(this.channelID)) return;
      if (!this.isConnected) return;
      if (!this.isFocused) return;
      if (!(this.hasServerNotification || this.hasDMNotification)) return;
      this.$socket.client.emit("notification:dismiss", {
        channelID: this.channelID
      });
    },
    setTitle() {
      if (this.DMChannel) {
        const recipient = this.DMChannel.recipients?.[0];
        if (!recipient) return;
        const isSavedNotes = recipient.id === MeModule.user.id;
        TabsModule.setCurrentTab({
          name: isSavedNotes ? "Saved Notes" : "@" + recipient.username,
          user_id: recipient.id
        });
      }
      if (this.server && this.channel) {
        const serverName = this.server?.name;
        const channelName = this.channel?.name;
        TabsModule.setCurrentTab({
          name: `${serverName}#${channelName}`,
          server_id: this.serverID,
          channel_id: this.channelID
        });
      }
    },
    onConnected() {
      this.loadChannelMessages();
    },
    channalIDChanged() {
      this.loadChannelMessages();
      this.dismissNotification();
    },
    channelChanged() {
      this.setTitle();
    },
    onFocusChange() {
      this.dismissNotification();
    }
  }
});
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
