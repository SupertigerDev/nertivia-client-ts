<template>
  <div class="friend">
    <div
      class="wrapper"
      @click="clickedEvent"
      @mouseover="hover = true"
      @mouseleave="hover = false"
    >
      <AvatarImage
        class="avatar"
        :imageId="user.avatar"
        :seedId="user.uniqueID"
        size="30px"
        :animateGif="hover"
      />
      <span class="username">{{ user.username }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import AvatarImage from "@/components/AvatarImage.vue";
import User from "@/interfaces/User";
import { ChannelsModule } from "@/store/modules/channels";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({ components: { AvatarImage } })
export default class FriendTemplate extends Vue {
  @Prop() private friend!: { recipient: User; status: number };
  hover = false;
  clickedEvent() {
    ChannelsModule.LoadDmChannel(this.friend.recipient.uniqueID);
  }
  get user() {
    return this.friend.recipient;
  }
}
</script>
<style lang="scss" scoped>
.wrapper {
  display: flex;
  align-content: center;
  align-items: center;
  border-radius: 4px;
  height: 40px;
  flex-shrink: 0;
  cursor: pointer;
  user-select: none;
  margin: 5px;
  margin-top: 2px;
  margin-bottom: 2px;
  transition: 0.2s;
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
}
.username {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.avatar {
  margin-right: 5px;
  margin-left: 5px;
}
</style>
