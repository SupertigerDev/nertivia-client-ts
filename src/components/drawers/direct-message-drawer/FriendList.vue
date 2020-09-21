<template>
  <div class="friend-list">
    <FriendTemplate
      v-for="friend in friends"
      :key="friend.recipient.uniqueID"
      :friend="friend"
    />
  </div>
</template>

<script lang="ts">
import { FriendsModule } from "@/store/modules/friends";
import { Component, Vue } from "vue-property-decorator";
import FriendTemplate from "./FriendTemplate.vue";

@Component({ components: { FriendTemplate } })
export default class FriendList extends Vue {
  get friends() {
    return FriendsModule.friendsWithUser;
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
</style>
