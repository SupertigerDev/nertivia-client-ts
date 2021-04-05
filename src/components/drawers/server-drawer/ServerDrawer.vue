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

import ChannelTemplate from "@/components/drawers/server-drawer/ChannelTemplate.vue";
import { PopoutsModule } from "@/store/modules/popouts";
@Component({ components: { ChannelTemplate } })
export default class ServerDrawer extends Vue {
  bannerHover = false;
  mounted() {
    window.addEventListener("keydown", this.onKeyDown);
  }
  beforeDestroy() {
    window.removeEventListener("keydown", this.onKeyDown);
  }
  onKeyDown(event: KeyboardEvent) {
    if (this.selectedServerChannels.length <= 1) return;
    if (event.ctrlKey) return;
    if (!event.altKey) return;
    const arrowUp = event.key === "ArrowUp";
    const arrowDown = event.key === "ArrowDown";
    if (arrowUp || arrowDown) {
      arrowUp && this.gotoPreviousChannel();
      arrowDown && this.gotoNextChannel();
      event.preventDefault();
    }
  }
  gotoPreviousChannel() {
    const channels = this.selectedServerChannels;
    const currentChannelIndex = channels.findIndex(
      c => c.channelID === this.selectedDetails.channel_id
    );
    let gotoIndex = currentChannelIndex;
    if (currentChannelIndex === -1) return;
    if (currentChannelIndex === 0) {
      gotoIndex = channels.length - 1;
    } else {
      gotoIndex = currentChannelIndex - 1;
    }
    const channelID = channels[gotoIndex].channelID;
    this.$router.push({
      params: { channel_id: channelID }
    });
  }
  gotoNextChannel() {
    const channels = this.selectedServerChannels;
    const currentChannelIndex = channels.findIndex(
      c => c.channelID === this.selectedDetails.channel_id
    );
    let gotoIndex = currentChannelIndex;
    if (currentChannelIndex === -1) return;
    if (currentChannelIndex === channels.length - 1) {
      gotoIndex = 0;
    } else {
      gotoIndex = currentChannelIndex + 1;
    }
    const channelID = channels[gotoIndex].channelID;
    this.$router.push({
      params: { channel_id: channelID }
    });
  }
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
    let str = `${process.env.VUE_APP_NERTIVIA_CDN}/${this.server.banner}`;
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
.bottom {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.channels {
  display: flex;
  flex-direction: column;
  overflow: auto;
}
.server-drawer {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.server-banner {
  height: 130px;
  background: rgba(0, 0, 0, 0.3);
  margin: 5px;
  margin-bottom: 0;
  border-radius: 4px;
  overflow: hidden;
  flex-shrink: 0;
  img {
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
}
@media (max-width: 950px) {
  .server-drawer {
    padding-bottom: 56px;
  }
}
</style>
