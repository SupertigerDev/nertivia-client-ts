<template>
  <div class="item" @click="onClick">
    <AvatarImage
      class="avatar"
      :imageId="details.avatar"
      :seedId="details.seed"
      size="30px"
      :animateGif="false"
    />
    <div class="information">
      <div class="username name">{{ details.name }}</div>
      <div class="server-name name" v-if="isServer">
        {{ details.serverName }}
      </div>
      <div class="channel-name name" v-if="isServer">
        <span>#</span>{{ details.channelName }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import AvatarImage from "@/components/AvatarImage.vue";
import Channel from "@/interfaces/Channel";
import Server from "@/interfaces/Server";
import Notification from "@/interfaces/Notification";
import { ChannelsModule } from "@/store/modules/channels";
import { PropType } from "vue";
import { defineComponent } from "vue";
export default defineComponent({
  name: "DashboardNotificationItem",
  components: { AvatarImage },
  props: {
    channel: {
      type: Object as PropType<Channel & { server: Server }>,
      required: true,
    },
    dmNotification: {
      type: Object as PropType<Notification>,
      required: true,
    },
  },
  computed: {
    isServer(): any {
      return this.channel?.server;
    },
    serverDetails(): any {
      return {
        avatar: this.channel.server.avatar,
        seed: this.channel.server_id,
        channelName: this.channel.name,
        serverName: this.channel.server.name,
      };
    },
    details(): any {
      if (this.isServer) {
        return this.serverDetails;
      } else {
        return {
          avatar: this.dmNotification.sender.avatar,
          seed: this.dmNotification.sender.id,
          name: this.dmNotification.sender.username,
        };
      }
    },
  },
  methods: {
    onClick() {
      if (this.isServer) {
        this.$router.push(
          `/app/servers/${this.channel.server_id}/${this.channel.channelId}`
        );
        return;
      }
      ChannelsModule.LoadDmChannel(this.dmNotification.sender.id);
    },
  },
});
</script>

<style lang="scss" scoped>
.item {
  display: flex;
  padding: 5px;
  align-content: center;
  align-items: center;
  border-radius: 4px;
  transition: 0.2s;
  user-select: none;
  cursor: pointer;
}
.item:hover {
  background: rgba(255, 255, 255, 0.1);
  .name {
    opacity: 1;
  }
  .channel-name {
    opacity: 0.5;
  }
}
.item-title {
  opacity: 0.8;
  margin-bottom: 10px;
}
.name {
  margin-left: 10px;
  opacity: 0.8;
  transition: 0.2;
}
.channel-name {
  opacity: 0.5;
}
.name span {
  opacity: 0.6;
}
</style>
