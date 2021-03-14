<template>
  <div class="common-friends">
    <div class="title">Common Friends</div>
    <div class="list">
      <div
        class="friend"
        v-for="item in friends"
        :key="item.uniqueID"
        :title="item.username"
        @click="friendClicked(item)"
      >
        <AvatarImage
          :seedId="item.uniqueID"
          :imageId="item.avatar"
          size="40px"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import AvatarImage from "@/components/AvatarImage.vue";
import { PopoutsModule } from "@/store/modules/popouts";
import User from "@/interfaces/User";
import { ChannelsModule } from "@/store/modules/channels";

@Component({
  components: { AvatarImage }
})
export default class CommonServers extends Vue {
  @Prop() private friends!: User[];
  friendClicked(friend: User) {
    ChannelsModule.LoadDmChannel(friend.uniqueID);
    PopoutsModule.ClosePopout("profile");
  }
}
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
