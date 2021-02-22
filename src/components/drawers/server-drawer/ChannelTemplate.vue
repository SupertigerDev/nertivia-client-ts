<template>
  <div
    class="channel"
    :class="{
      selected: isChannelSelected,
      hasNotification: notificationExists
    }"
    @contextmenu.prevent="showContext"
    @click="channelClicked"
  >
    <div class="muted material-icons" v-if="isMuted">notifications_off</div>
    <div class="dot" v-else></div>
    <div class="name">{{ channel.name }}</div>
    <div
      v-if="notificationExists && notificationExists.mentioned"
      class="notification dot mentioned"
    >
      {{ notificationExists.mentioned ? "@" : "" }}
    </div>
  </div>
</template>

<script lang="ts">
import Channel from "@/interfaces/Channel";
import { DrawersModule } from "@/store/modules/drawers";
import { LastSeenServerChannelsModule } from "@/store/modules/lastSeenServerChannel";
import { MutedChannelsModule } from "@/store/modules/mutedChannels";
import { PopoutsModule } from "@/store/modules/popouts";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class ChannelTemplate extends Vue {
  @Prop() private channel!: Channel;

  channelClicked() {
    DrawersModule.SetLeftDrawer(false);
    this.$router.push(
      `/app/servers/${this.channel.server_id}/${this.channel.channelID}`
    );
  }
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
  get notificationExists() {
    return LastSeenServerChannelsModule.serverChannelNotification(
      this.channel.channelID
    );
  }
  get isMuted() {
    return MutedChannelsModule.mutedChannels.includes(this.channel.channelID);
  }
  get isChannelSelected() {
    return this.$route.params.channel_id === this.channel.channelID;
  }
}
</script>

<style lang="scss" scoped>
.channel {
  display: flex;
  align-items: center;
  color: rgba(255, 255, 255, 0.7);
  margin: 4px;
  height: 30px;
  user-select: none;
  position: relative;
  overflow: hidden;
  content-visibility: auto;
  contain-intrinsic-size: 30px;
  border-radius: 4px;
  cursor: pointer;
  transition: 0.2s;
  &:before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: 3px;
    bottom: 0;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  &.selected {
    background: rgba(255, 255, 255, 0.1);
    &:before {
      background: var(--primary-color);
    }
    color: white;
    .dot {
      opacity: 1;
    }
  }
  &.hasNotification {
    &:before {
      background: var(--alert-color);
    }
  }
}
.name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.dot {
  height: 7px;
  width: 7px;
  opacity: 0.7;
  background: white;
  margin-left: 10px;
  margin-right: 10px;
  border-radius: 50%;
  flex-shrink: 0;
  &.notification {
    height: 10px;
    width: 10px;
    background: var(--alert-color);
    margin: auto;
    margin-right: 10px;
    opacity: 1;
  }
  &.mentioned {
    color: white;
    align-items: center;
    align-content: center;
    justify-content: center;
    display: flex;
    font-size: 12px;
    width: 20px;
    height: 20px;
  }
}
.muted {
  font-size: 18px;
  margin-left: 5px;
  margin-right: 5px;
}
</style>
