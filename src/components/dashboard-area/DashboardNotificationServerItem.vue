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
        class="template"
        v-for="channel in notifications"
        :key="channel.channelId"
        :channel="channel"
      />
    </div>
  </div>
</template>

<script lang="ts">
import AvatarImage from "@/components/AvatarImage.vue";
import ChannelTemplate from "@/components/drawers/server-drawer/ChannelTemplate.vue";
import Notification from "@/interfaces/Notification";
import { ServersModule } from "@/store/modules/servers";
import { PropType } from "vue";
import { defineComponent } from "vue";
export default defineComponent({
  name: "DashboardNotificationItem",
  components: { AvatarImage, ChannelTemplate },
  props: {
    notifications: {
      type: Object as PropType<Notification>,
      required: true,
    },
    serverID: {
      type: String,
      required: true,
    },
  },
  computed: {
    serverDetails(): any {
      return ServersModule.servers[this.serverID];
    },
  },
});
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
.template {
  margin: 0;
}
</style>
