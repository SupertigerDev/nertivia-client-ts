<template>
  <div class="server-drawer">
    <transition name="zoom-fade" mode="out-in">
      <div
        @mouseenter="bannerHover = true"
        @mouseleave="bannerHover = false"
        class="server-banner"
        :key="selectedDetails.server_id"
        v-if="server && server.banner"
      >
        <img :src="bannerURL" />
      </div>
    </transition>
    <transition name="slide-fade" mode="out-in">
      <div class="channels" :key="selectedDetails.server_id">
        <ChannelTemplate
          v-for="channel in selectedServerChannels"
          :key="channel.channelID"
          :channel="channel"
        />
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { ChannelsModule } from "@/store/modules/channels";
import { ServersModule } from "@/store/modules/servers";
import { Component, Vue } from "vue-property-decorator";
import config from "@/config";

import ChannelTemplate from "@/components/drawers/server-drawer/ChannelTemplate.vue";
@Component({ components: { ChannelTemplate } })
export default class MainApp extends Vue {
  bannerHover = false;
  get selectedDetails() {
    return {
      server_id: this.$route.params.server_id,
      channel_id: this.$route.params.channel_id
    };
  }
  get server() {
    return ServersModule.servers[this.selectedDetails.server_id];
  }
  get bannerURL() {
    return `${config.nertiviaCDN}/${this.server.banner}${
      this.bannerHover ? "" : "?type=webp"
    }`;
  }
  get selectedServerChannels() {
    if (!this.selectedDetails.server_id) return [];
    return ChannelsModule.sortedServerChannels(this.selectedDetails.server_id);
  }
}
</script>

<style lang="scss" scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease;
  // transition-delay: 0.1s;
}
.slide-fade-leave-active {
  transition: all 0.1s;
}
.slide-fade-leave-to {
  opacity: 0;
}

.slide-fade-enter {
  transform: translateY(10px);
  opacity: 0;
}

.zoom-fade-enter-active {
  transition: all 0.2s ease;
}
.zoom-fade-leave-active {
  transition: all 0.1s;
}
.zoom-fade-leave-to {
  opacity: 0;
}

.zoom-fade-enter {
  transform: scale(0.9);
  opacity: 0;
}
.server-drawer {
  display: flex;
  flex-direction: column;
}

.server-banner {
  height: 130px;
  background: rgba(0, 0, 0, 0.3);
  margin: 5px;
  border-radius: 4px;
  overflow: hidden;
  img {
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
}
</style>
