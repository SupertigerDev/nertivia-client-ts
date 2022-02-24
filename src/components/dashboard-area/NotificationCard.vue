<template>
  <div class="card">
    <div class="title">
      {{ $t("dashboard-tab.notifications") }}
    </div>
    <div v-if="!notificatinExists" class="caught-up">
      {{ $t("dashboard-tab.caught-up") }}
    </div>
    <div class="item-title" v-if="dmNotifications.length">
      {{ $t("dashboard-tab.direct-messages") }}
    </div>
    <DashboardNotificationItem
      v-for="notification in dmNotifications"
      :key="notification.channelId"
      :dmNotification="notification"
    />
    <div class="item-title" v-if="serverChannelNotifications.length">
      {{ $t("dashboard-tab.servers") }}
    </div>
    <DashboardNotificationServerItem
      v-for="(n, serverID) of serverChannelNotifications"
      :key="serverID"
      :serverID="serverID"
      :notifications="n"
    />
  </div>
</template>

<script lang="ts">
import DashboardNotificationItem from "@/components/dashboard-area/DashboardNotificationItem.vue";
import DashboardNotificationServerItem from "@/components/dashboard-area/DashboardNotificationServerItem.vue";

import { LastSeenServerChannelsModule } from "@/store/modules/lastSeenServerChannel";
import { NotificationsModule } from "@/store/modules/notifications";

import { defineComponent } from "vue";
export default defineComponent({
  name: "DashboardArea",
  components: { DashboardNotificationItem, DashboardNotificationServerItem },
  computed: {
    dmNotifications(): any {
      return NotificationsModule.allDMNotifications;
    },
    serverChannelNotifications(): any {
      const allServerNotifications =
        LastSeenServerChannelsModule.allServerNotifications;
      const obj: any = {};

      for (let i = 0; i < allServerNotifications.length; i++) {
        const notification = allServerNotifications[i];
        if (!notification.server_id) continue;
        if (!obj[notification.server_id]) {
          obj[notification.server_id] = [notification];
          continue;
        }
        obj[notification.server_id].push(notification);
      }

      return obj;
    },
    notificatinExists(): any {
      return (
        this.dmNotifications.length ||
        Object.keys(this.serverChannelNotifications).length
      );
    },
  },
});
</script>
<style lang="scss" scoped>
.content .title {
  margin: 10px;
  margin-left: 5px;
  font-size: 20px;
}
.card {
  border: solid 1px rgba(255, 255, 255, 0.1);
  margin: 10px;
  margin-top: 10px;
  background: var(--card-color);
  padding: 5px;
  display: flex;
  flex-direction: column;
  height: 300px;
  width: 250px;
  border-radius: 4px;
  overflow: auto;
  overflow-x: hidden;
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
