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
import ContextMenu from "@/components/ContextMenu.vue";
import { PopoutsModule } from "@/store/modules/popouts";
import { ServersModule } from "@/store/modules/servers";
import { MeModule } from "@/store/modules/me";
import { ServerMembersModule } from "@/store/modules/serverMembers";
import { leaveServer } from "@/services/serverService";
import { LastSeenServerChannelsModule } from "@/store/modules/lastSeenServerChannel";
import { PropType } from "vue";
import { defineComponent } from "vue";
import { toClipboard } from "@soerenmartius/vue3-clipboard";
export default defineComponent({
  name: "ServerContextMenu",
  components: { ContextMenu },
  props: {
    data: {
      type: Object as PropType<{
        x: number;
        y: number;
        server_id: string;
      }>,
      required: true,
    },
  },
  computed: {
    items(): any {
      let items: any = [
        {
          id: "mark_as_read",
          name: this.$t("server-context.mark-as-read"),
          icon: "markunread_mailbox",
          disabled: !this.notifications.length,
        },
        { type: "seperator" },
      ];

      if (this.isServerOwner || this.isAdmin) {
        items.push({
          id: "server_settings",
          name: this.$t("server-context.server-settings"),
          icon: "settings",
        });
      }

      items = [
        ...items,
        {
          id: "manage_invites",
          name: this.$t("server-settings.tab-names.manage-invites"),
          icon: "settings",
        },
        {
          id: "manage_notification",
          name: this.$t("server-settings.tab-names.manage-notification"),
          icon: "notifications",
        },
        { type: "seperator" },
        {
          id: "copy_id",
          name: this.$t("copy-id-button"),
          icon: "developer_board",
        },
      ];
      if (!this.isServerOwner) {
        items.push({ type: "seperator" });
        items.push({
          id: "leave_server",
          name: this.$t("server-context.leave-server"),
          warn: true,
          icon: "exit_to_app",
        });
      }

      return items;
    },
    pos(): any {
      return {
        x: this.data.x,
        y: this.data.y,
      };
    },
    server(): any {
      return ServersModule.servers[this.data.server_id];
    },
    isServerOwner(): any {
      return this.server.creator.id === MeModule.user.id;
    },
    notifications(): any {
      return LastSeenServerChannelsModule.serverNotifications(
        this.server.server_id
      );
    },
    isAdmin(): any {
      return ServerMembersModule.isAdmin(
        MeModule.user.id || undefined,
        this.server.server_id
      );
    },
  },
  methods: {
    close() {
      PopoutsModule.ClosePopout("context");
    },
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
          PopoutsModule.ShowPopout({
            id: "leave-server",
            component: "LeaveServerConfirmPopout",
            data: {
              serverId: this.data.server_id,
            },
          });
          break;
        case "copy_id":
          toClipboard(this.server.server_id);
          break;
        case "mark_as_read":
          this.markAsRead();
          break;
        default:
          break;
      }
    },
    markAsRead() {
      for (let i = 0; i < this.notifications.length; i++) {
        const { channelId } = this.notifications[i];
        this.$socket.emit("notification:dismiss", {
          channelId,
        });
      }
    },
  },
});
</script>

<style scoped></style>
