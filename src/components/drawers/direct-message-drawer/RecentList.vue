<template>
  <div class="friend-list">
    <RecycleScroller
      style="height: 100%"
      :items="recentListArr"
      key-field="channelId"
      :item-size="44"
      v-slot="{ item }"
    >
      <FriendTemplate
        :style="{ height: '44px' }"
        :friend="item.sender"
        :dmChannel="item"
      />
    </RecycleScroller>
  </div>
</template>

<script lang="ts">
import { ChannelsModule } from "@/store/modules/channels";
import { MeModule } from "@/store/modules/me";
import { NotificationsModule } from "@/store/modules/notifications";
import FriendTemplate from "./FriendTemplate.vue";
import { RecycleScroller } from "vue-virtual-scroller";
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";

import { defineComponent } from "vue";
export default defineComponent({
  name: "RecentList",
  components: { FriendTemplate, RecycleScroller },
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
        (c) => c.recipients?.[0]?.id !== this.me.id
      );
      // move channels with notifications to top.
      const sort = filter.sort((a, b) => {
        const aN = NotificationsModule.notificationByChannelID(a.channelId);
        const bN = NotificationsModule.notificationByChannelID(b.channelId);
        if (aN && !bN) return -1;
        if (!aN && bN) return 1;
        return 0;
      });
      return [...highPriority, ...sort];
    },
  },
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
</style>
