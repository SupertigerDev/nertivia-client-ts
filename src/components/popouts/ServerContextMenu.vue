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
    switch (item.name) {
      case "Server Settings":
        this.$router.push(
          `/app/servers/${this.data.server_id}/settings/general`
        );
        break;
      case "Manage Invites":
        this.$router.push(
          `/app/servers/${this.data.server_id}/settings/manage-invites`
        );
        break;
      case "Manage Notification":
        this.$router.push(
          `/app/servers/${this.data.server_id}/settings/manage-notification`
        );
        break;
      case "Leave Server":
        this.leaveServer();
        break;
      case "Copy ID":
        this.$copyText(this.server.server_id);
        break;
      case "Mark As Read":
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
        name: "Mark As Read",
        icon: "markunread_mailbox",
        disabled: !this.notifications.length
      },
      { type: "seperator" }
    ];

    if (this.isServerOwner || this.isAdmin) {
      items.push({
        name: "Server Settings",
        icon: "settings"
      });
    }

    items = [
      ...items,
      {
        name: "Manage Invites",
        icon: "settings"
      },
      {
        name: "Manage Notification",
        icon: "notifications"
      },
      { type: "seperator" },
      {
        name: "Copy ID",
        icon: "developer_board"
      }
    ];
    if (!this.isServerOwner) {
      items.push({ type: "seperator" });
      items.push({
        name: "Leave Server",
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
    return this.server.creator.uniqueID === MeModule.user.uniqueID;
  }
  get notifications() {
    return LastSeenServerChannelsModule.serverNotifications(
      this.server.server_id
    );
  }
  get isAdmin() {
    return ServerMembersModule.isAdmin(
      MeModule.user.uniqueID || undefined,
      this.server.server_id
    );
  }
}
</script>

<style scoped></style>
