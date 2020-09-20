<template>
  <div class="server-drawer">
    <div class="channels">
      <ChannelTemplate
        v-for="channel in selectedServerChannels"
        :key="channel.channelID"
        :channel="channel"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { ChannelsModule } from "@/store/modules/channels";
import { Component, Vue } from "vue-property-decorator";

const ChannelTemplate = () =>
  import(
    /* webpackChunkName: "ChannelTemplate" */ "@/components/drawers/server-drawer/ChannelTemplate.vue"
  );
@Component({ components: { ChannelTemplate } })
export default class MainApp extends Vue {
  get selectedDetails() {
    return {
      server_id: this.$route.params.server_id,
      channel_id: this.$route.params.channel_id
    };
  }
  get selectedServerChannels() {
    if (!this.selectedDetails.server_id) return [];
    return ChannelsModule.serverChannels(this.selectedDetails.server_id);
  }
}
</script>
