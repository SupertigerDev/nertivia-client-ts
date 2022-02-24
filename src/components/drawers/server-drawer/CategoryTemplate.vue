<template>
  <div class="outer-channel-template">
    <a
      href="#"
      class="channel channel-template"
      @click="collapsed = !collapsed"
      @mouseover="hover = true"
      @mouseout="hover = false"
      :class="{
        selected: isChannelSelected && collapsed,
        hasNotification: channelNotifications?.length,
        hasIcon: iconURL != null,
      }"
      :style="channelStyle"
      @contextmenu.prevent="showContext"
    >
      <div v-if="iconURL" class="icon" aria-hidden="true"></div>
      <div v-if="!iconURL" class="icon material-icons" aria-hidden="true">
        segment
      </div>
      <div class="name">{{ category.name }}</div>
      <div class="collapse-status material-icons" v-if="!collapsed">keyboard_arrow_up</div>
      <div class="collapse-status material-icons" v-if="collapsed">keyboard_arrow_down</div>
    </a>
    <ul class="channels" v-if="!collapsed">
      <li v-for="channel in channels" :key="channel.channelId">
        <ChannelTemplate :channel="channel" />
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Channel from "@/interfaces/Channel";
import { DrawersModule } from "@/store/modules/drawers";
import { LastSeenServerChannelsModule } from "@/store/modules/lastSeenServerChannel";
import { PopoutsModule } from "@/store/modules/popouts";
import { emojiURL } from "@/utils/emojiParser";
import { PropType } from "vue";
import { defineComponent } from "vue";
import { ChannelsModule } from "@/store/modules/channels";
import ChannelTemplate from "./ChannelTemplate.vue";
export default defineComponent({
  name: "CategoryTemplate",
  components: { ChannelTemplate },
  props: {
    category: {
      type: Object as PropType<Channel>,
      required: true,
    },
  },
  data() {
    return {
      hover: false,
      collapsed: false,
    };
  },
  computed: {
    selectedDetails(): any {
      return {
        server_id: this.$route.params.server_id,
        channel_id: this.$route.params.channel_id,
      };
    },
    channelNotifications(): any {
      return LastSeenServerChannelsModule.serverNotifications(this.selectedDetails.server_id, this.category.channelId)
    },
    channels(): any[] {
      if (!this.selectedDetails.server_id) return [];
      return ChannelsModule.sortedServerChannels(
        this.selectedDetails.server_id
      ).filter((channel) => channel.categoryId === this.category.channelId);
    },
    isChannelSelected(): any {
      return this.channels.find(
        (c) => c.channelId === this.selectedDetails.channel_id
      );
    },
    iconURL(): any {
      const icon = this.category.icon;
      if (!icon) return null;
      const isCustom = icon.startsWith("g_") || icon.startsWith("c_");
      const isGif = icon.startsWith("g_");
      const customEmojiID = icon.split("_")[1];
      return emojiURL(isCustom ? customEmojiID : icon, {
        animated: this.hover,
        isCustom,
        isGif,
      });
    },
    channelStyle(): any {
      return {
        "--icon-url": this.iconURL && `url("${this.iconURL}")`,
      };
    },
  },
  methods: {
    closeDrawer() {
      DrawersModule.SetLeftDrawer(false);
    },
    showContext(event: any) {
      PopoutsModule.ShowPopout({
        id: "context",
        component: "ChannelContextMenu",
        key: this.category.server_id + event.clientX + event.clientY,
        data: {
          x: event.clientX,
          y: event.clientY,
          server_id: this.category.server_id,
          channelId: this.category.channelId,
        },
      });
    },
  },
});
</script>

<style lang="scss" scoped>
.channel {
  display: grid;
  grid-template-columns: 1.3rem 1fr 0fr;
  grid-template-rows: min-content;
  gap: 0.25rem;
  position: relative;

  align-content: center;

  block-size: 2rem;
  content-visibility: auto;
  contain-intrinsic-size: 2rem;

  margin-inline: 0.5rem;
  padding-inline: 0.5rem 0.5rem;

  border-radius: 3px;

  color: rgb(255 255 255 / 0.7);

  text-decoration: none;
  user-select: none;
  white-space: nowrap;
  overflow: hidden;

  &:before {
    content: "";
    position: absolute;
    left: 0;
    top: 5px;
    bottom: 5px;
    width: 4px;
    transition: 0.1s;
    border-radius: 4px;
  }

  &:hover {
    background: rgb(255 255 255 / 0.1);
    &:before {
      background: var(--primary-color);
      opacity: 0.4;
    }
  }
  &.selected {
    color: white;
    &:before {
      background: var(--primary-color);
      opacity: 1;
    }
  }
  &.hasNotification {
    &:before {
      background: var(--alert-color);
      opacity: 1;
    }
  }
}
.collapse-status {
  font-size: 18px;
}
.channels {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  padding: 0;

  list-style: none;
  margin-top: 5px;
}

.icon {
  overflow: hidden;
  align-self: center;
  justify-self: center;
  display: flex;
}
.hasIcon .icon {
  width: 1rem;
  height: 1rem;
  background-image: var(--icon-url);
  background-size: cover;
}

.icon.material-icons {
  font-size: 18px;
}

.name {
  position: relative;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
