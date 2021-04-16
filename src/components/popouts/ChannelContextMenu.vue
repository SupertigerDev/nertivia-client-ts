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
import { LastSeenServerChannelsModule } from "@/store/modules/lastSeenServerChannel";
import { ChannelsModule } from "@/store/modules/channels";
import { MutedChannelsModule } from "@/store/modules/mutedChannels";
import {
  muteServerChannel,
  unmuteServerChannel
} from "@/services/channelService";

@Component({ components: { ContextMenu } })
export default class extends Vue {
  @Prop() private data!: {
    x: number;
    y: number;
    server_id: string;
    channelID: string;
  };

  close() {
    PopoutsModule.ClosePopout("context");
  }
  itemClick(item: any) {
    switch (item.id) {
      case "copy_id":
        this.$copyText(this.data.channelID);
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
      default:
        break;
    }
  }
  markAsRead() {
    this.$socket.client.emit("notification:dismiss", {
      channelID: this.data.channelID
    });
  }
  get items() {
    const items: any = [
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
  get channel() {
    return ChannelsModule.channels[this.data.channelID];
  }
  get notifications() {
    return LastSeenServerChannelsModule.serverChannelNotification(
      this.data.channelID
    );
  }
  get isMuted() {
    return MutedChannelsModule.mutedChannels.includes(this.channel.channelID);
  }
}
</script>

<style scoped></style>
