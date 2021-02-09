<template>
  <div class="item">
    <AvatarImage
      class="avatar"
      :imageId="serverDetails.avatar"
      :seedId="serverDetails.server_id"
      size="30px"
      :animateGif="false"
    />
    <div class="information">
      <div class="server-name name">
        {{ serverDetails.name }}
      </div>
      <ChannelTemplate
        class="channel"
        v-for="channel in notifications"
        :key="channel.channelID"
        :channel="channel"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

import AvatarImage from "@/components/AvatarImage.vue";
import ChannelTemplate from "@/components/drawers/server-drawer/ChannelTemplate.vue";
import Notification from "@/interfaces/Notification";
import { ServersModule } from "@/store/modules/servers";

@Component({ components: { AvatarImage, ChannelTemplate } })
export default class DashboardNotificationItem extends Vue {
  @Prop() private notifications!: Notification;
  @Prop() private serverID!: string;
  get serverDetails() {
    return ServersModule.servers[this.serverID];
  }
}
</script>

<style lang="scss" scoped>
.item {
  display: flex;
  align-content: center;
  align-items: center;
  border-radius: 4px;
  padding-left: 5px;
  transition: 0.2s;
  user-select: none;
}

.avatar {
  align-self: flex-start;
}
.item-title {
  opacity: 0.8;
  margin-bottom: 10px;
}
.name {
  margin-left: 10px;
  transition: 0.2;
  margin-top: 5px;
  margin-bottom: 5px;
}

.information {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  width: 100%;
}
.channel {
  margin: 0;
}
</style>
