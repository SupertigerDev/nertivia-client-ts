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
import { ServersModule } from "@/store/modules/servers";
import { MeModule } from "@/store/modules/me";
import router from "@/router";
import { ServerMembersModule } from "@/store/modules/serverMembers";
import { leaveServer } from "@/services/serverService";
import { NotificationsModule } from "@/store/modules/notifications";
import { LastSeenServerChannelsModule } from "@/store/modules/lastSeenServerChannel";

@Component({ components: { ContextMenu } })
export default class extends Vue {
  @Prop() private data!: {
    x: number;
    y: number;
    server_id: string;
  };

  close() {
    PopoutsModule.ClosePopout("context");
  }
  async leaveServer() {
    leaveServer(this.server.server_id);
  }
  itemClick(item: any) {
    switch (item.id) {
      case "server_settings":
        this.$router.push(
          `/app/servers/${this.data.server_id}/settings/general`
        );
        break;
      case "manage_invites":
        this.$router.push(
          `/app/servers/${this.data.server_id}/settings/manage-invites`
        );
        break;
      case "manage_notification":
        this.$router.push(
          `/app/servers/${this.data.server_id}/settings/manage-notification`
        );
        break;
      case "leave_server":
        this.leaveServer();
        break;
      case "copy_id":
        this.$copyText(this.server.server_id);
        break;
      case "mark_as_read":
        this.markAsRead();
        break;
      default:
        break;
    }
  }
  markAsRead() {
    for (let i = 0; i < this.notifications.length; i++) {
      const { channelID } = this.notifications[i];
      this.$socket.client.emit("notification:dismiss", {
        channelID
      });
    }
  }
  get items() {
    let items: any = [
      {
        id: "mark_as_read",
        name: this.$t("server-context.mark-as-read"),
        icon: "markunread_mailbox",
        disabled: !this.notifications.length
      },
      { type: "seperator" }
    ];

    if (this.isServerOwner || this.isAdmin) {
      items.push({
        id: "server_settings",
        name: this.$t("server-context.server-settings"),
        icon: "settings"
      });
    }

    items = [
      ...items,
      {
        id: "manage_invites",
        name: this.$t("server-settings.tab-names.manage-invites"),
        icon: "settings"
      },
      {
        id: "manage_notification",
        name: this.$t("server-settings.tab-names.manage-notification"),
        icon: "notifications"
      },
      { type: "seperator" },
      {
        id: "copy_id",
        name: this.$t("copy-id-button"),
        icon: "developer_board"
      }
    ];
    if (!this.isServerOwner) {
      items.push({ type: "seperator" });
      items.push({
        id: "leave_server",
        name: this.$t("server-context.leave-server"),
        warn: true,
        icon: "exit_to_app"
      });
    }

    return items;
  }
  get pos() {
    return {
      x: this.data.x,
      y: this.data.y
    };
  }
  get server() {
    return ServersModule.servers[this.data.server_id];
  }
  get isServerOwner() {
    return this.server.creator.id === MeModule.user.id;
  }
  get notifications() {
    return LastSeenServerChannelsModule.serverNotifications(
      this.server.server_id
    );
  }
  get isAdmin() {
    return ServerMembersModule.isAdmin(
      MeModule.user.id || undefined,
      this.server.server_id
    );
  }
}
</script>

<style scoped></style>
