<template>
  <ContextMenu
    ref="context"
    :items="items"
    :pos="pos"
    :element="data.element"
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
import { permissions } from "@/constants/rolePermissions";
import User from "@/interfaces/User";

@Component({ components: { ContextMenu } })
export default class extends Vue {
  x: number | null = null;
  @Prop() private data!: {
    x: number;
    y: number;
    id: string;
    tempUser: User;
    parentContextWidth?: number;
    element: HTMLElement;
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
    if (item.id === "copy_id") {
      this.$copyText(this.data.id);
      return;
    }
    if (item.id === "copy_user_tag") {
      this.$copyText(
        `${this.data.tempUser.username}:${this.data.tempUser.tag}`
      );
      return;
    }
    if (item.id === "view_profile") {
      PopoutsModule.ShowPopout({
        id: "profile",
        component: "profile-popout",
        data: { id: this.data.id }
      });
    }
    if (item.id === "edit_roles") {
      PopoutsModule.ShowPopout({
        id: "edit-role",
        component: "edit-roles-popout",
        data: { id: this.data.id, serverID: this.serverID }
      });
    }
    if (item.id === "kick" || item.id === "ban") {
      PopoutsModule.ShowPopout({
        id: "ban-or-kick-user-popout",
        component: "ban-or-kick-user-popout",
        data: {
          id: this.data.id,
          serverID: this.serverID,
          tempUser: this.data.tempUser,
          action: item.id.toUpperCase()
        }
      });
    }
  }

  get items() {
    let items: any = [
      {
        id: "view_profile",
        name: this.$t("user-context.view-profile"),
        icon: "person"
      }
    ];

    if (this.canManageRoles && this.userExistsInServer) {
      items.push({
        id: "edit_roles",
        name: this.$t("user-context.edit-roles"),
        icon: "leaderboard"
      });
    }
    if (this.hasBanPermission || this.hasKickPermission) {
      items.push({ type: "seperator" });
    }
    if (this.hasKickPermission && this.userExistsInServer) {
      items.push({
        id: "kick",
        name: this.$t("user-context.kick"),
        icon: "exit_to_app",
        warn: true
      });
    }
    if (this.hasBanPermission) {
      items.push({
        id: "ban",
        name: this.$t("user-context.ban"),
        icon: "block",
        warn: true
      });
    }
    items.push({ type: "seperator" });

    items = [
      ...items,
      {
        id: "copy_user_tag",
        name: this.$t("user-context.copy-user-tag"),
        icon: "developer_board"
      },
      {
        id: "copy_id",
        name: this.$t("copy-id-button"),
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
    return MeModule.user.id === server.creator.id;
  }
  get canManageRoles() {
    if (!this.serverID) return false;
    if (this.isServerOwner) return true;
    if (!MeModule.user.id) return false;
    return ServerMembersModule.memberHasPermission(
      MeModule.user.id,
      this.serverID,
      permissions.MANAGE_ROLES.value
    );
  }
  get myHighestRolePosition() {
    if (!this.serverID) return 0;
    if (!MeModule.user.id) return 0;
    const highestRoleOrder = ServerMembersModule.highestRoleOrder(
      this.serverID,
      MeModule.user.id
    );
    return highestRoleOrder || 0;
  }
  get recipientRolePosition() {
    if (!this.serverID) return 0;
    const highestRoleOrder = ServerMembersModule.highestRoleOrder(
      this.serverID,
      this.data.id
    );
    return highestRoleOrder || 0;
  }

  get hasBanPermission() {
    if (!this.serverID) return false;
    if (MeModule.user.id === this.data.id) return false;
    if (this.isServerOwner) return true;
    if (!MeModule.user.id) return false;
    if (this.recipientRolePosition <= this.myHighestRolePosition) return false;
    return ServerMembersModule.memberHasPermission(
      MeModule.user.id,
      this.serverID,
      permissions.BAN_USER.value
    );
  }
  get hasKickPermission() {
    if (!this.serverID) return false;
    if (MeModule.user.id === this.data.id) return false;
    if (this.isServerOwner) return true;
    if (!MeModule.user.id) return false;
    if (this.recipientRolePosition <= this.myHighestRolePosition) return false;
    return ServerMembersModule.memberHasPermission(
      MeModule.user.id,
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
    return ServerMembersModule.serverMembers[this.serverID][this.data.id];
  }
}
</script>

<style scoped></style>
