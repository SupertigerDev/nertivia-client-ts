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
import { LastSeenServerChannelsModule } from "@/store/modules/lastSeenServerChannel";
import { ChannelsModule } from "@/store/modules/channels";
import { MutedChannelsModule } from "@/store/modules/mutedChannels";
import {
  muteServerChannel,
  unmuteServerChannel
} from "@/services/channelService";
import { ServerMembersModule } from "@/store/modules/serverMembers";
import { MeModule } from "@/store/modules/me";
import { permissions } from "@/constants/rolePermissions";
import { PropType } from "vue";
import { defineComponent } from "vue";
import { toClipboard } from "@soerenmartius/vue3-clipboard";
export default defineComponent({
  name: "ChannelContextMenu",
  components: { ContextMenu },
  props: {
    data: {
      type: Object as PropType<{
        x: number;
        y: number;
        server_id: string;
        channelID: string;
      }>,
      required: true
    }
  },
  computed: {
    items(): any {
      const items: any[] = [
        {
          id: "mark_as_read",
          name: this.$t("server-context.mark-as-read"),
          icon: "markunread_mailbox",
          disabled: !this.notifications
        },
        {
          id: this.isMuted ? "unmute_channel" : "mute_channel",
          name: this.isMuted
            ? this.$t("channel-context.unmute-channel")
            : this.$t("channel-context.mute-channel"),
          icon: this.isMuted ? "notifications" : "notifications_off",
          warn: !this.isMuted
        },
        { type: "seperator" },
        {
          id: "copy_id",
          name: this.$t("copy-id-button"),
          icon: "developer_board"
        }
      ];

      if (this.isCreator || this.canManageChannels) {
        items.unshift({
          id: "channel_settings",
          name: "Channel Settings",
          icon: "settings",
          hidden: !this.notifications
        });
      }

      return items;
    },
    pos(): any {
      return {
        x: this.data.x,
        y: this.data.y
      };
    },
    server(): any {
      return ServersModule.servers[this.data.server_id];
    },
    channel(): any {
      return ChannelsModule.channels[this.data.channelID];
    },
    isCreator(): any {
      return this.server?.creator?.id === MeModule.user.id;
    },
    canManageChannels(): any {
      return ServerMembersModule.memberHasPermission(
        MeModule.user.id || "",
        this.server.server_id,
        permissions["MANAGE_CHANNELS"].value
      );
    },
    notifications(): any {
      return LastSeenServerChannelsModule.serverChannelNotification(
        this.data.channelID
      );
    },
    isMuted(): any {
      return MutedChannelsModule.mutedChannels.includes(this.channel.channelID);
    }
  },
  methods: {
    close() {
      PopoutsModule.ClosePopout("context");
    },
    itemClick(item: any) {
      switch (item.id) {
        case "copy_id":
          toClipboard(this.data.channelID);
          break;
        case "mark_as_read":
          this.markAsRead();
          break;
        case "unmute_channel":
          unmuteServerChannel(this.server.server_id, this.channel.channelID);
          break;
        case "mute_channel":
          muteServerChannel(this.server.server_id, this.channel.channelID);
          break;
        case "channel_settings":
          this.$router.push(
            `/app/servers/${this.server.server_id}/settings/manage-channels/${this.data.channelID}`
          );
          break;
        default:
          break;
      }
    },
    markAsRead() {
      this.$socket.emit("notification:dismiss", {
        channelID: this.data.channelID
      });
    }
  }
});
</script>

<style scoped></style>
