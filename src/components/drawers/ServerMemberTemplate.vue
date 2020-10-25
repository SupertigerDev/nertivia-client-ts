<template>
  <div
    class="server-member"
    @mouseover="hover = true"
    @mouseleave="hover = false"
    @click="showProfile = true"
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
    <portal to="popups" v-if="showProfile">
      <ProfilePopout :uniqueID="member.uniqueID" @close="showProfile = false" />
    </portal>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import AvatarImage from "@/components/AvatarImage.vue";
import { ServerRolesModule } from "@/store/modules/serverRoles";
import ServerMember from "@/interfaces/ServerMember";
import User from "@/interfaces/User";
import ServerRole from "@/interfaces/ServerRole";
import ProfilePopout from "@/components/ProfilePopout.vue";
@Component({ components: { AvatarImage, ProfilePopout } })
export default class RightDrawer extends Vue {
  showProfile = false;
  @Prop() private serverMember!: ServerMember & {
    member: User;
    roles: ServerRole[];
  };
  hover = false;
  get member() {
    return this.serverMember.member;
  }
  get firstRoleColor() {
    if (this.serverMember.roles[0]) {
      return this.serverMember.roles[0].color;
    }
    if (this.defaultRole && this.defaultRole.color) {
      return this.defaultRole.color;
    }
    return undefined;
  }
  get defaultRole() {
    return ServerRolesModule.defaultServerRole(this.serverMember.server_id);
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
