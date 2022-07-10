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
        <ul
          class="channels"
          :key="server.server_id"
          :style="{
            transitionDelay: server && server.banner ? '0.2s' : '0.1s',
          }"
        >
          <template
            v-for="channel in selectedServerChannels"
            :key="channel.channelId"
          >
            <li v-if="channel.type === 1 && !channel.categoryId">
              <ChannelTemplate :channel="channel" />
            </li>
            <li v-if="channel.type === 2">
              <CategoryTemplate :category="channel" />
            </li>
          </template>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { ChannelsModule } from "@/store/modules/channels";
import { ServersModule } from "@/store/modules/servers";
import ChannelTemplate from "@/components/drawers/server-drawer/ChannelTemplate.vue";
import CategoryTemplate from "@/components/drawers/server-drawer/CategoryTemplate.vue";
import { PopoutsModule } from "@/store/modules/popouts";
import { LastSeenServerChannelsModule } from "@/store/modules/lastSeenServerChannel";

import { defineComponent } from "vue";
import Channel from "@/interfaces/Channel";
import { ChannelType } from "@/interfaces/DmChannel";
export default defineComponent({
  name: "ServerDrawer",
  components: { ChannelTemplate, CategoryTemplate },
  data() {
    return {
      bannerHover: false,
    };
  },
  computed: {
    selectedDetails(): any {
      return {
        server_id: this.$route.params.server_id,
        channel_id: this.$route.params.channel_id,
      };
    },
    // all channels, including categories.
    selectedServerChannels(): Channel[] {
      if (!this.selectedDetails.server_id) return [];
      return ChannelsModule.sortedServerChannels(
        this.selectedDetails.server_id
      );
    },
    // all text channels only.
    channelsOnly(): Channel[] {
      return this.selectedServerChannels.filter(
        (chan) => chan.type === ChannelType.SERVER_CHANNEL
      );
    },
    server(): any {
      return ServersModule.servers[this.selectedDetails.server_id];
    },
    bannerURL(): any {
      const isGif = this.server.banner.endsWith(".gif");
      let str = `${process.env.VUE_APP_NERTIVIA_CDN}${this.server.banner}`;
      if (isGif && !this.bannerHover) {
        str = str + "?type=webp";
      }
      return str;
    },
  },
  mounted() {
    window.addEventListener("keydown", this.onKeyDown);
  },
  beforeUnmount() {
    window.removeEventListener("keydown", this.onKeyDown);
  },
  methods: {
    onKeyDown(event: KeyboardEvent) {
      if (this.channelsOnly.length <= 1) return;
      if (event.ctrlKey) return;
      if (!event.altKey) return;
      const arrowUp = event.key === "ArrowUp";
      const arrowDown = event.key === "ArrowDown";
      if (arrowUp) {
        if (event.shiftKey) {
          this.goToPreviousUnreadChannel();
        } else {
          this.goToPreviousChannel();
        }
      } else if (arrowDown) {
        if (event.shiftKey) {
          this.goToNextUnreadChannel();
        } else {
          this.goToNextChannel();
        }
      }
      event.preventDefault();
    },
    goToPreviousChannel() {
      const channels = this.channelsOnly;
      const currentChannelIndex = channels.findIndex(
        (c) => c.channelId === this.selectedDetails.channel_id
      );
      let gotoIndex = currentChannelIndex;
      if (currentChannelIndex === -1) return;
      if (currentChannelIndex === 0) {
        gotoIndex = channels.length - 1;
      } else {
        gotoIndex = currentChannelIndex - 1;
      }
      const channelId = channels[gotoIndex].channelId;
      this.$router.push({
        params: { channel_id: channelId },
      });
    },
    goToPreviousUnreadChannel() {
      const servers = ServersModule.sortedServers;
      const allUnreadChannelIds =
        LastSeenServerChannelsModule.allServerNotifications.map(
          (notification) => notification.channelId
        );
      if (allUnreadChannelIds.length === 0) return;

      const channels = servers
        .map((server) => ChannelsModule.sortedServerChannels(server.server_id))
        .flatMap((serverChannels) => serverChannels.map((channel) => channel));

      const startIndex = channels.findIndex(
        (channel) => channel.channelId === this.selectedDetails.channel_id
      );
      if (startIndex === -1) {
        throw new Error("Couldn't find currently selected channel.");
      }

      let currentIndex = startIndex;
      do {
        currentIndex--;
        if (currentIndex === -1) currentIndex = channels.length - 1;
        if (allUnreadChannelIds.includes(channels[currentIndex].channelId))
          break;
      } while (currentIndex !== startIndex);

      this.$router.push({
        params: {
          server_id:
            channels[currentIndex].server_id ?? this.selectedDetails.server_id,
          channel_id: channels[currentIndex].channelId,
        },
      });
    },
    goToNextChannel() {
      const channels = this.channelsOnly;
      const currentChannelIndex = channels.findIndex(
        (c) => c.channelId === this.selectedDetails.channel_id
      );
      let gotoIndex = currentChannelIndex;
      if (currentChannelIndex === -1) return;
      if (currentChannelIndex === channels.length - 1) {
        gotoIndex = 0;
      } else {
        gotoIndex = currentChannelIndex + 1;
      }
      const channelId = channels[gotoIndex].channelId;
      this.$router.push({
        params: { channel_id: channelId },
      });
    },
    goToNextUnreadChannel() {
      const servers = ServersModule.sortedServers;
      const allUnreadChannelIds =
        LastSeenServerChannelsModule.allServerNotifications.map(
          (notification) => notification.channelId
        );
      if (allUnreadChannelIds.length === 0) return;

      const channels = servers
        .map((server) => ChannelsModule.sortedServerChannels(server.server_id))
        .flatMap((serverChannels) => serverChannels.map((channel) => channel));

      const startIndex = channels.findIndex(
        (channel) => channel.channelId === this.selectedDetails.channel_id
      );
      if (startIndex === -1) {
        throw new Error("Couldn't find currently selected channel.");
      }

      let currentIndex = startIndex;
      do {
        currentIndex = ++currentIndex % channels.length;
        if (allUnreadChannelIds.includes(channels[currentIndex].channelId))
          break;
      } while (currentIndex !== startIndex);

      this.$router.push({
        params: {
          server_id:
            channels[currentIndex].server_id ?? this.selectedDetails.server_id,
          channel_id: channels[currentIndex].channelId,
        },
      });
    },
    showServerContext(event: any) {
      PopoutsModule.ShowPopout({
        id: "context",
        component: "ServerContextMenu",
        key: this.server.server_id + event.clientX + event.clientY,
        data: {
          x: event.clientX,
          y: event.clientY,
          server_id: this.server.server_id,
        },
      });
    },
  },
});
</script>

<style lang="scss" scoped>
.slide-fade-enter-active {
  transition: all 0.2s ease;
}

.slide-fade-enter-from {
  transform: translateY(10px);
  opacity: 0;
}

.zoom-fade-enter-active {
  transition: all 0.3s ease;
}

.zoom-fade-enter-from {
  transform: scale(0.9);
  opacity: 0;
}

.server-drawer {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  width: 250px;
}

.bottom {
  display: flex;
  flex-direction: column;
  overflow: auto;
}

.server-drawer,
.bottom,
.channels {
  flex: 1;
}

.channels {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  padding: 0;

  list-style: none;
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
