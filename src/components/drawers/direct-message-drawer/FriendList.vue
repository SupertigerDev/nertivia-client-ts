<template>
  <div class="friend-list">
    <RecycleScroller
      style="height: 100%"
      :items="list"
      key-field="id"
      v-slot="{ item }"
    >
      <div class="tab" :style="{ height: '25px' }" v-if="item.name">
        {{ item.name }}
      </div>
      <Component
        v-else
        :is="
          item.componentType === 'fr'
            ? 'FriendRequestTemplate'
            : 'FriendTemplate'
        "
        :style="{ height: '44px' }"
        :friend="item"
      />
    </RecycleScroller>
  </div>
</template>

<script lang="ts">
import { FriendsModule } from "@/store/modules/friends";
import FriendTemplate from "./FriendTemplate.vue";
import FriendRequestTemplate from "./FriendRequestTemplate.vue";
import { RecycleScroller } from "vue-virtual-scroller";
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";

import { defineComponent } from "vue";
export default defineComponent({
  name: "FriendList",
  components: { FriendTemplate, FriendRequestTemplate, RecycleScroller },
  computed: {
    friends(): any {
      return FriendsModule.friendsWithUser;
    },
    onlineFriends(): any {
      return this.friends.filter((f) => f.presence && f.status === 2);
    },
    offlineFriends(): any {
      return this.friends.filter((f) => !f.presence && f.status === 2);
    },
    friendRequests(): any {
      return this.friends.filter((f) => f.status <= 1);
    },
    list(): any {
      let componentType = "";
      return [
        { id: "fr", name: "Requests", size: 25 },
        ...this.friendRequests,
        { id: "on", name: "Online", size: 25 },
        ...this.onlineFriends,
        { id: "off", name: "Offline", size: 25 },
        ...this.offlineFriends,
      ].map((f) => {
        if (f.name) {
          componentType = f.id;
          if (f.id === "fr" && !this.friendRequests.length) {
            f.size = 0;
            return f;
          }
          if (f.id === "on" && !this.onlineFriends.length) {
            f.size = 0;
            return f;
          }
          if (f.id === "off" && !this.offlineFriends.length) {
            f.size = 0;
            return f;
          }
          return f;
        }
        f.size = 44;
        f.componentType = componentType;
        if (componentType === "fr") {
          f.size = 79;
        }
        return f;
      });
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
.tab {
  display: flex;
  align-items: center;
  align-content: center;
  margin-left: 6px;
  height: 25px;
  flex-shrink: 0;
}
</style>
