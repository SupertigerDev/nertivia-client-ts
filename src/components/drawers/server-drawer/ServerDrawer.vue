<template>
  <div class="server-drawer">
    <transition
      name="zoom-fade"
      mode="out-in"
      v-if="server && server.banner"
      appear
    >
      <div
        @mouseenter="bannerHover = true"
        @mouseleave="bannerHover = false"
        class="server-banner"
        :key="server.server_id"
      >
        <img :src="bannerURL" />
      </div>
    </transition>
    <transition name="slide-fade" mode="out-in" appear v-if="server">
      <div class="bottom">
        <div class="info">
          <div class="server-name">{{ server.name }}</div>
          <div class="material-icons icon" @click="showServerContext">
            more_vert
          </div>
        </div>
        <div
          class="channels"
          :key="server.server_id"
          :style="{
            transitionDelay: server && server.banner ? '0.2s' : '0.1s'
          }"
        >
          <ChannelTemplate
            v-for="channel in selectedServerChannels"
            :key="channel.channelID"
            :channel="channel"
          />
        </div>
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
import { PopoutsModule } from "@/store/modules/popouts";
@Component({ components: { ChannelTemplate } })
export default class MainApp extends Vue {
  bannerHover = false;

  showServerContext(event: any) {
    PopoutsModule.ShowPopout({
      id: "context",
      component: "ServerContextMenu",
      key: this.server.server_id + event.clientX + event.clientY,
      data: {
        x: event.clientX,
        y: event.clientY,
        server_id: this.server.server_id
      }
    });
  }
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
    const isGif = this.server.banner.endsWith(".gif");
    let str = `${config.nertiviaCDN}/${this.server.banner}`;
    if (isGif && !this.bannerHover) {
      str = str + "?type=webp";
    }
    return str;
  }
  get selectedServerChannels() {
    if (!this.selectedDetails.server_id) return [];
    return ChannelsModule.sortedServerChannels(this.selectedDetails.server_id);
  }
}
</script>

<style lang="scss" scoped>
.slide-fade-enter-active {
  transition: all 0.2s ease;
}

.slide-fade-enter {
  transform: translateY(10px);
  opacity: 0;
}

.zoom-fade-enter-active {
  transition: all 0.3s ease;
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
  margin-bottom: 0;
  border-radius: 4px;
  overflow: hidden;
  img {
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
}
.info {
  display: flex;
  margin-left: 5px;
  margin-right: 5px;
  background: rgba(255, 255, 255, 0.05);
  align-items: center;
  align-content: center;
  border-radius: 4px;
  margin-top: 5px;
  .server-name {
    padding-left: 5px;
    flex: 1;
    font-weight: bold;
  }
  .icon {
    flex-shrink: 0;
    padding: 5px;
    font-size: 18px;
    border-radius: 4px;
    transition: 0.2s;
    cursor: pointer;
    user-select: none;
    opacity: 0.7;
    &:hover {
      opacity: 1;
      background: rgba(255, 255, 255, 0.1);
    }
  }
}
</style>
