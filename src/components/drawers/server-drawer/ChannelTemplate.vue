<template>
  <div
    class="outer-channel-template"
    :class="{ nestedChannel: channel.categoryId }"
  >
    <router-link
      :to="path"
      class="channel channel-template"
      @click="closeDrawer"
      @mouseover="hover = true"
      @mouseout="hover = false"
      :class="{
        selected: isChannelSelected,
        hasNotification: notificationExists,
        hasIcon: iconURL != null,
        isMuted,
      }"
      :style="channelStyle"
      @contextmenu.prevent="showContext"
    >
      <div class="icon" aria-hidden="true"></div>
      <div class="name">{{ channel.name }}</div>
      <div class="muted material-icons" v-if="isMuted">notifications_off</div>
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
import {
  voiceChannelModule,
  CallParticipant,
} from "@/store/modules/voiceChannels";
import { DrawersModule } from "@/store/modules/drawers";
import { LastSeenServerChannelsModule } from "@/store/modules/lastSeenServerChannel";
import { MutedChannelsModule } from "@/store/modules/mutedChannels";
import { PopoutsModule } from "@/store/modules/popouts";
import { emojiURL } from "@/utils/emojiParser";
import { PropType } from "vue";
import CallTemplate from "./CallTemplate.vue";
import { defineComponent } from "vue";
export default defineComponent({
  components: { CallTemplate },
  name: "ChannelTemplate",
  props: {
    channel: {
      type: Object as PropType<Channel>,
      required: true,
    },
  },
  data() {
    return {
      hover: false,
    };
  },
  computed: {
    callParticipants(): CallParticipant[] {
      return voiceChannelModule.callParticipants(this.channel.channelId);
    },
    path(): any {
      return `/app/servers/${this.channel.server_id}/${this.channel.channelId}`;
    },
    notificationExists(): any {
      return LastSeenServerChannelsModule.serverChannelNotification(
        this.channel.channelId
      );
    },
    isMuted(): any {
      return MutedChannelsModule.mutedChannels.includes(this.channel.channelId);
    },
    isChannelSelected(): any {
      return this.$route.params.channel_id === this.channel.channelId;
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
        key: this.channel.server_id + event.clientX + event.clientY,
        data: {
          x: event.clientX,
          y: event.clientY,
          server_id: this.channel.server_id,
          channelId: this.channel.channelId,
        },
      });
    },
  },
});
</script>

<style lang="scss" scoped>

.nestedChannel {
  .channel {
    padding-left: 35px;
    &:before {
      left: 25px;
    }
  }
}

.channel {
  display: grid;
  grid-template-columns: 1rem 1fr;
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
  &.isMuted {
    grid-template-columns: 1rem 1fr 1rem;
  }
  .muted {
    opacity: 0.4;
    font-size: 18px;
  }
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

  &.selected,
  &.hasNotification {
    &:before {
      background: var(--alert-color);
      opacity: 1;
    }
  }

  &.selected {
    color: white;
    background: rgb(255 255 255 / 0.1);
    &:before {
      background: var(--primary-color);
      opacity: 1;
    }
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
