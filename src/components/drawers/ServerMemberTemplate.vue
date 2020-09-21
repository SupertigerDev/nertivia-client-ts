<template>
  <div
    class="server-member"
    @mouseover="hover = true"
    @mouseleave="hover = false"
  >
    <AvatarImage
      class="avatar"
      :imageId="member.avatar"
      :seedId="member.uniqueID"
      size="30px"
      :animateGif="hover"
    />
    <span class="username" :style="{ color: firstRoleColor }">{{
      member.username
    }}</span>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import AvatarImage from "@/components/AvatarImage.vue";
@Component({ components: { AvatarImage } })
export default class RightDrawer extends Vue {
  @Prop() private serverMember!: any;
  hover = false;
  get member() {
    return this.serverMember.member;
  }
  get firstRoleColor() {
    if (this.serverMember.roles[0]) {
      return this.serverMember.roles[0].color;
    }
    return undefined;
  }
}
</script>

<style lang="scss" scoped>
.server-member {
  display: flex;
  align-content: center;
  align-items: center;
  border-radius: 4px;
  height: 40px;
  flex-shrink: 0;
  margin-left: 5px;
  cursor: pointer;
  user-select: none;
  margin-right: 5px;
  transition: 0.2s;
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
}
.avatar {
  margin-right: 5px;
  margin-left: 5px;
}
</style>
