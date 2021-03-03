<template>
  <ContextMenu
    ref="context"
    :items="items"
    :pos="pos"
    @itemClick="itemClick"
    @close="close"
  />
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import ContextMenu from "@/components/ContextMenu.vue";
import { PopoutsModule } from "@/store/modules/popouts";
import WindowProperties from "@/utils/windowProperties";
import { ServerMembersModule } from "@/store/modules/serverMembers";
import { MeModule } from "@/store/modules/me";
import { ServersModule } from "@/store/modules/servers";
import { addPerm, permissions } from "@/constants/rolePermissions";
import User from "@/interfaces/User";

@Component({ components: { ContextMenu } })
export default class extends Vue {
  x: number | null = null;
  @Prop() private data!: {
    x: number;
    y: number;
    uniqueID: string;
    tempUser: User;
    parentContextWidth?: number;
  };

  mounted() {
    // move to right if cant fit with parent context.
    this.x = this.data.x;
    if (this.data.parentContextWidth) {
      if (!this.data.x) return;
      const thisWidth = (this.$refs.context as any).width;
      const rightPos = this.data.x + thisWidth;
      if (rightPos > WindowProperties.resizeWidth) {
        this.x = this.data.x - (thisWidth + this.data.parentContextWidth + 5);
      }
    }
  }
  close() {
    PopoutsModule.ClosePopout("context");
  }
  itemClick(item: any) {
    if (item.name === "Copy ID") {
      this.$copyText(this.data.uniqueID);
      return;
    }
    if (item.name === "Copy User:Tag") {
      this.$copyText(
        `${this.data.tempUser.username}:${this.data.tempUser.tag}`
      );
      return;
    }
    if (item.name === "View Profile") {
      PopoutsModule.ShowPopout({
        id: "profile",
        component: "profile-popout",
        data: { uniqueID: this.data.uniqueID }
      });
    }
    if (item.name === "Edit Roles") {
      PopoutsModule.ShowPopout({
        id: "edit-role",
        component: "edit-roles-popout",
        data: { uniqueID: this.data.uniqueID, serverID: this.serverID }
      });
    }
    if (item.name === "Kick" || item.name === "Ban") {
      PopoutsModule.ShowPopout({
        id: "ban-or-kick-user-popout",
        component: "ban-or-kick-user-popout",
        data: {
          uniqueID: this.data.uniqueID,
          serverID: this.serverID,
          tempUser: this.data.tempUser,
          action: item.name.toUpperCase()
        }
      });
    }
  }

  get items() {
    let items: any = [
      {
        name: "View Profile",
        icon: "person"
      }
    ];

    if (this.canManageRoles && this.userExistsInServer) {
      items.push({ name: "Edit Roles", icon: "leaderboard" });
    }
    if (this.hasBanPermission || this.hasKickPermission) {
      items.push({ type: "seperator" });
    }
    if (this.hasKickPermission && this.userExistsInServer) {
      items.push({ name: "Kick", icon: "exit_to_app", warn: true });
    }
    if (this.hasBanPermission) {
      items.push({ name: "Ban", icon: "block", warn: true });
    }
    items.push({ type: "seperator" });

    items = [
      ...items,
      {
        name: "Copy User:Tag",
        icon: "developer_board"
      },
      {
        name: "Copy ID",
        icon: "developer_board"
      }
    ];

    return items;
  }
  get pos() {
    return {
      x: this.x,
      y: this.data.y
    };
  }
  get isServerOwner() {
    if (!this.serverID) return false;
    const server = ServersModule.servers[this.serverID];
    return MeModule.user.uniqueID === server.creator.uniqueID;
  }
  get canManageRoles() {
    if (!this.serverID) return false;
    if (this.isServerOwner) return true;
    if (!MeModule.user.uniqueID) return false;
    return ServerMembersModule.memberHasPermission(
      MeModule.user.uniqueID,
      this.serverID,
      permissions.MANAGE_ROLES.value
    );
  }
  get hasBanPermission() {
    if (!this.serverID) return false;
    if (MeModule.user.uniqueID === this.data.uniqueID) return false;
    if (this.isServerOwner) return true;
    if (!MeModule.user.uniqueID) return false;
    return ServerMembersModule.memberHasPermission(
      MeModule.user.uniqueID,
      this.serverID,
      permissions.BAN_USER.value
    );
  }
  get hasKickPermission() {
    if (!this.serverID) return false;
    if (MeModule.user.uniqueID === this.data.uniqueID) return false;
    if (this.isServerOwner) return true;
    if (!MeModule.user.uniqueID) return false;
    return ServerMembersModule.memberHasPermission(
      MeModule.user.uniqueID,
      this.serverID,
      permissions.KICK_USER.value
    );
  }
  get serverID() {
    if (this.currentTab !== "servers") return undefined;
    return this.$route.params.server_id;
  }
  get currentTab() {
    return this.$route.path.split("/")[2];
  }
  get userExistsInServer() {
    if (!this.serverID) return undefined;
    return ServerMembersModule.serverMembers[this.serverID][this.data.uniqueID];
  }
}
</script>

<style scoped></style>
