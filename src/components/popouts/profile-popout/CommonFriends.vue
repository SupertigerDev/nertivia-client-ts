<template>
  <div class="common-friends">
    <div class="title">{{ $t("profile-popout.common-friends") }}</div>
    <div class="list">
      <div
        class="friend"
        v-for="item in friends"
        :key="item.id"
        :title="item.username"
        @click="friendClicked(item)"
      >
        <AvatarImage :seedId="item.id" :imageId="item.avatar" size="40px" />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import AvatarImage from "@/components/AvatarImage.vue";
import { PopoutsModule } from "@/store/modules/popouts";
import User from "@/interfaces/User";
import { PropType } from "vue";
import { defineComponent } from "vue";
export default defineComponent({
  name: "CommonServers",
  components: { AvatarImage },
  props: {
    friends: {
      type: Array as PropType<User[]>,
      required: true,
    },
  },
  methods: {
    friendClicked(friend: User) {
      PopoutsModule.ShowPopout({
        id: "profile",
        component: "profile-popout",
        data: { id: friend.id },
        key: friend.id,
      });
    },
  },
});
</script>
<style scoped lang="scss">
.list {
  display: flex;
  overflow: auto;
}
.friend {
  flex-shrink: 0;
  margin: 3px;
  cursor: pointer;
  opacity: 0.7;
  transition: 0.2s;
  &:hover {
    opacity: 1;
  }
}
</style>
