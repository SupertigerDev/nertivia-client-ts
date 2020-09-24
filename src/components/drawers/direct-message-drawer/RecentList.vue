<template>
  <div class="friend-list">
    <virtual-list :size="260" :remain="40" :variable="true">
      <FriendTemplate
        v-for="dmChannel in recentListArr"
        :style="{ height: '44px' }"
        :key="dmChannel.channelID"
        :dmChannel="dmChannel"
      />
    </virtual-list>
  </div>
</template>

<script lang="ts">
import { ChannelsModule } from "@/store/modules/channels";
import { Component, Vue } from "vue-property-decorator";
import FriendTemplate from "./FriendTemplate.vue";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const virtualList = require("vue-virtual-scroll-list");

@Component({ components: { FriendTemplate, virtualList } })
export default class RecentList extends Vue {
  get dmChannels() {
    return ChannelsModule.getDMChannels;
  }

  get recentListArr() {
    return this.dmChannels;
  }
}
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
