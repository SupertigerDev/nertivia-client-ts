<template>
  <div class="card">
    <div class="title">
      Notifications
    </div>
    <div v-if="!notificatinExists" class="caught-up">All Caught up!</div>
    <div class="item-title" v-if="serverMentionedNotifications.length">
      Mentions
    </div>
    <DashboardNotificationItem
      v-for="(channel, i) in serverMentionedNotifications"
      :key="i"
      :channel="channel"
    />
    <div class="item-title" v-if="dmNotifications.length">
      Direct Messages
    </div>
    <DashboardNotificationItem
      v-for="(notification, i) in dmNotifications"
      :key="i"
      :dmNotification="notification"
    />
    <div class="item-title" v-if="serverChannelNotifications.length">
      Servers
    </div>
    <DashboardNotificationItem
      v-for="(channel, i) in serverChannelNotifications"
      :key="i"
      :channel="channel"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

import DashboardNotificationItem from "@/components/dashboard-area/DashboardNotificationItem.vue";

import { LastSeenServerChannelsModule } from "@/store/modules/lastSeenServerChannel";
import { ServersModule } from "@/store/modules/servers";
import { NotificationsModule } from "@/store/modules/notifications";
@Component({ components: { DashboardNotificationItem } })
export default class DashboardArea extends Vue {
  get dmNotifications() {
    return NotificationsModule.allDMNotifications;
  }
  get serverMentionedNotifications() {
    return this.serverChannelNotifications.filter(n => n.mentioned);
  }
  get serverChannelNotifications() {
    return LastSeenServerChannelsModule.allServerNotifications.map(channel => {
      if (!channel.server_id) return channel;
      const server = ServersModule.servers[channel.server_id];
      return { ...channel, server };
    });
  }
  get notificatinExists() {
    return (
      this.dmNotifications.length ||
      this.serverChannelNotifications.length ||
      this.serverMentionedNotifications.length
    );
  }
}
</script>
<style lang="scss" scoped>
.content .title {
  margin: 10px;
  margin-left: 5px;
  font-size: 20px;
}
.card {
  margin: 10px;
  margin-top: 10px;
  background: rgba(0, 0, 0, 0.18);
  padding: 5px;
  display: flex;
  flex-direction: column;
  height: 300px;
  width: 250px;
  border-radius: 8px;
  overflow: auto;
  .item-title {
    opacity: 0.8;
    margin-left: 5px;
    user-select: none;
  }
}
.caught-up {
  margin: auto;
}
</style>
