<template>
  <div
    class="server-member"
    @mouseover="hover = true"
    @mouseleave="hover = false"
    @contextmenu.prevent="rightClickEvent"
    @click="showProfile"
  >
    <AvatarImage
      class="avatar"
      :imageId="member.avatar"
      :seedId="member.uniqueID"
      size="30px"
      :animateGif="hover"
    />
    <div class="details">
      <span class="username" :style="{ color: firstRoleColor }">{{
        member.username
      }}</span>
      <div class="custom-and-presence" v-if="presence">
        <div
          class="presence-color"
          :style="{ backgroundColor: presence.color }"
        />
        <div class="custom-status" v-if="customStatus">{{ customStatus }}</div>
        <div class="custom-status" v-else>{{ presence.name }}</div>
      </div>
    </div>
    <span class="badge" :title="badge[0]" :class="badge[0]" v-if="badge"
      ><img :src="badge[1]"
    /></span>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import AvatarImage from "@/components/AvatarImage.vue";
import { ServerRolesModule } from "@/store/modules/serverRoles";
import ServerMember from "@/interfaces/ServerMember";
import User from "@/interfaces/User";
import ServerRole from "@/interfaces/ServerRole";
import { PopoutsModule } from "@/store/modules/popouts";
import { ServerMembersModule } from "@/store/modules/serverMembers";
import { permissions } from "@/constants/rolePermissions";
import config from "@/config";
import { CustomStatusesModule } from "@/store/modules/memberCustomStatus";
import { PresencesModule } from "@/store/modules/presences";
import userStatuses from "@/constants/userStatuses";

@Component({ components: { AvatarImage } })
export default class RightDrawer extends Vue {
  @Prop() private serverMember!: ServerMember & {
    member: User;
    roles: ServerRole[];
  };
  hover = false;

  rightClickEvent(event: MouseEvent) {
    PopoutsModule.ShowPopout({
      id: "context",
      component: "UserContextMenu",
      key: this.member.uniqueID + event.clientX + event.clientY,
      data: {
        x: event.clientX,
        y: event.clientY,
        uniqueID: this.member.uniqueID
      }
    });
  }
  showProfile() {
    const rect = (this.$el as HTMLElement).getBoundingClientRect();
    PopoutsModule.ShowPopout({
      id: "profile",
      component: "MiniProfilePopout",
      data: {
        x: rect.x,
        y: rect.y,
        member: this.serverMember
      }
    });
  }
  get member() {
    return this.serverMember.member;
  }
  get customStatus() {
    return CustomStatusesModule.customStatus[this.member.uniqueID];
  }
  get presence() {
    const presence = PresencesModule.getPresence(this.member.uniqueID);
    if (!presence) return undefined;
    return userStatuses[presence || 0];
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
  get badge() {
    if (this.serverMember.type === "OWNER")
      return ["owner", config.twemojiLocations + "1f451.svg"];

    if (this.serverMember.type === "BOT")
      return ["bot", config.twemojiLocations + "1f916.svg"];
    const uniqueID = this.serverMember.uniqueID;
    const serverID = this.serverMember.server_id;
    const memberHasPermission = ServerMembersModule.memberHasPermission;
    if (memberHasPermission(uniqueID, serverID, permissions.ADMIN.value)) {
      return ["admin", config.twemojiLocations + "1f6e1.svg"];
    }
    return null;
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
.username {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.details {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.custom-status {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 12px;
  opacity: 0.6;
}
.custom-and-presence {
  display: flex;
  align-items: center;
  align-content: center;
}
.presence-color {
  height: 10px;
  width: 10px;
  margin-right: 5px;
  border-radius: 50%;
  flex-shrink: 0;
}

.badge {
  font-size: 12px;
  padding: 3px;
  border-radius: 4px;
  margin-left: 5px;
  flex-shrink: 0;
  height: 20px;
  width: 20px;
  margin-left: auto;
  margin-right: 5px;

  img {
    width: 100%;
    flex-shrink: 0;
    height: 100%;
  }
  &.owner {
    background: #995f13;
  }
  &.bot {
    background: #443dac;
  }
  &.admin {
    background: #337c9e;
  }
}
</style>
