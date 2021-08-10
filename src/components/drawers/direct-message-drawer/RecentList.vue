<template>
  <div class="friend-list">
    <virtual-list :size="260" :remain="40" :variable="true">
      <FriendTemplate
        v-for="dmChannel in recentListArr"
        :style="{ height: '44px' }"
        :key="dmChannel.channelID"
        :friend="dmChannel.sender"
        :dmChannel="dmChannel"
      />
    </virtual-list>
  </div>
</template>

<script lang="ts">
import { ChannelsModule } from "@/store/modules/channels";
import { MeModule } from "@/store/modules/me";
import { NotificationsModule } from "@/store/modules/notifications";
import FriendTemplate from "./FriendTemplate.vue";
import Vue from "vue";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const virtualList = require("vue-virtual-scroll-list");
export default Vue.extend({
  name: "RecentList",
  components: { FriendTemplate, virtualList },
  computed: {
    dmChannels(): any {
      return ChannelsModule.getDMChannels;
    },
    sortedChannels(): any {
      // idk why reverse() is needed but it fixes the order...
      return [...this.dmChannels]
        .reverse()
        .sort((a, b) => b.lastMessaged - a.lastMessaged);
    },
    me(): any {
      return MeModule.user;
    },
    recentListArr(): any {
      // unopened dms
      const highPriority = NotificationsModule.newDMNotifications;
      // filter self (saved notes)
      const filter = this.sortedChannels.filter(
        c => c.recipients?.[0]?.id !== this.me.id
      );
      // move channels with notifications to top.
      const sort = filter.sort((a, b) => {
        const aN = NotificationsModule.notificationByChannelID(a.channelID);
        const bN = NotificationsModule.notificationByChannelID(b.channelID);
        if (aN && !bN) return -1;
        if (!aN && bN) return 1;
        return 0;
      });
      return [...highPriority, ...sort];
    }
  }
});
</script>
<style lang="scss" scoped>
.friend-list {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}
.tab {
  display: flex;
  align-items: center;
  align-content: center;
  margin-left: 6px;
  height: 25px;
  flex-shrink: 0;
}
</style>
