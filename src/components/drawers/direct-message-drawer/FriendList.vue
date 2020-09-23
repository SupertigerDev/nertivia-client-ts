<template>
  <div class="friend-list">
    <virtual-list :size="260" :remain="40" :variable="true">
      <div class="tab" :style="{ height: '25px' }">Online</div>
      <FriendTemplate
        v-for="friend in onlineFriends"
        :style="{ height: '44px' }"
        :key="friend.recipient.uniqueID"
        :friend="friend"
      />
      <div class="tab" :style="{ height: '25px' }">Offline</div>
      <FriendTemplate
        v-for="friend in offlineFriends"
        :style="{ height: '44px' }"
        :key="friend.recipient.uniqueID"
        :friend="friend"
      />
    </virtual-list>
  </div>
</template>

<script lang="ts">
import { FriendsModule } from "@/store/modules/friends";
import { Component, Vue } from "vue-property-decorator";
import FriendTemplate from "./FriendTemplate.vue";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const virtualList = require("vue-virtual-scroll-list");

@Component({ components: { FriendTemplate, virtualList } })
export default class FriendList extends Vue {
  get friends() {
    return FriendsModule.friendsWithUser;
  }
  get onlineFriends() {
    return this.friends.filter(f => f.presence && f.status === 2);
  }
  get offlineFriends() {
    return this.friends.filter(f => !f.presence && f.status === 2);
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
