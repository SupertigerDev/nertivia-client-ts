<template>
  <div class="outer-channel-template">
    <router-link
      :to="path"
      class="channel channel-template"
      @click.native="closeDrawer"
      @mouseover.native="hover = true"
      @mouseout.native="hover = false"
      :class="{
        selected: isChannelSelected,
        hasNotification: notificationExists,
        hasIcon: iconURL != null
      }"
      :style="channelStyle"
      @contextmenu.prevent.native="showContext"
    >
      <div class="icon" aria-hidden="true"></div>
      <div class="name">{{ channel.name }}</div>
    </router-link>
    <div class="call-participants" v-if="callParticipants.length">
      <div class="text">In call:</div>
      <CallTemplate
        v-for="participant in callParticipants"
        :key="participant.user.id"
        :participant="participant"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Channel from "@/interfaces/Channel";
import { voiceChannelModule, CallParticipant } from "@/store/modules/voiceChannels";
import { DrawersModule } from "@/store/modules/drawers";
import { LastSeenServerChannelsModule } from "@/store/modules/lastSeenServerChannel";
import { MutedChannelsModule } from "@/store/modules/mutedChannels";
import { PopoutsModule } from "@/store/modules/popouts";
import { emojiURL } from "@/utils/emojiParser";
import Vue, { PropType } from "vue";
import CallTemplate from "./CallTemplate.vue";
export default Vue.extend({
  components: { CallTemplate },
  name: "ChannelTemplate",
  props: {
    channel: {
      type: Object as PropType<Channel>,
      required: false
    }
  },
  data() {
    return {
      hover: false
    };
  },
  computed: {
    callParticipants(): CallParticipant[] {
      return voiceChannelModule.callParticipants(this.channel.channelID);
    },
    path(): any {
      return `/app/servers/${this.channel.server_id}/${this.channel.channelID}`;
    },
    notificationExists(): any {
      return LastSeenServerChannelsModule.serverChannelNotification(
        this.channel.channelID
      );
    },
    isMuted(): any {
      return MutedChannelsModule.mutedChannels.includes(this.channel.channelID);
    },
    isChannelSelected(): any {
      return this.$route.params.channel_id === this.channel.channelID;
    },
    iconURL(): any {
      const icon = this.channel.icon;
      if (!icon) return null;
      const isCustom = icon.startsWith("g_") || icon.startsWith("c_");
      const isGif = icon.startsWith("g_");
      const customEmojiID = icon.split("_")[1];
      return emojiURL(isCustom ? customEmojiID : icon, {
        animated: this.hover,
        isCustom,
        isGif
      });
    },
    channelStyle(): any {
      return {
        "--icon-url": this.iconURL && `url("${this.iconURL}")`
      };
    }
  },
  methods: {
    closeDrawer() {
      DrawersModule.SetLeftDrawer(false);
    },
    showContext(event: any) {
      PopoutsModule.ShowPopout({
        id: "context",
        component: "ChannelContextMenu",
        key: this.channel.server_id + event.clientX + event.clientY,
        data: {
          x: event.clientX,
          y: event.clientY,
          server_id: this.channel.server_id,
          channelID: this.channel.channelID
        }
      });
    }
  }
});
</script>

<style lang="scss" scoped>
.channel {
  display: grid;
  grid-template-columns: 1rem 1fr;
  grid-template-rows: min-content;
  gap: 0.25rem;

  align-content: center;

  block-size: 2rem;
  content-visibility: auto;
  contain-intrinsic-size: 2rem;

  margin-inline: 0.5rem;
  padding-inline: 0.5rem 0.5rem;

  border-inline-start: 3px solid transparent;
  border-radius: 3px;

  color: rgb(255 255 255 / 0.7);

  text-decoration: none;
  user-select: none;
  white-space: nowrap;
  overflow: hidden;

  &:hover {
    background: rgb(255 255 255 / 0.1);
  }

  &.selected,
  &.hasNotification {
    border-start-start-radius: 0px;
    border-end-start-radius: 0px;
  }

  &.hasNotification {
    border-color: var(--alert-color);
  }

  &.selected {
    color: white;
    background: rgb(255 255 255 / 0.1);
    border-color: var(--primary-color);
  }
}
.call-participants {
  margin-left: 40px;
  margin-top: 5px;
  .text {
    font-weight: bold;
  }
}

.icon {
  overflow: hidden;
  align-self: center;
  justify-self: center;

  display: flex;
}

.channel:not(.hasIcon) .icon {
  width: 0.5rem;
  height: 0.5rem;
  background: currentColor;
  border-radius: 100%;
}

.hasIcon .icon {
  width: 1rem;
  height: 1rem;
  background-image: var(--icon-url);
  background-size: cover;
}

.name {
  position: relative;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
