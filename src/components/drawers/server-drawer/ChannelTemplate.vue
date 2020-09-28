<template>
  <div
    class="channel"
    :class="{
      selected: isChannelSelected
    }"
    @click="channelClicked"
  >
    <div class="dot"></div>
    <div class="name">{{ channel.name }}</div>
    <div v-if="notificationExists" class="notification dot"></div>
  </div>
</template>

<script lang="ts">
import Channel from "@/interfaces/Channel";
import { DrawersModule } from "@/store/modules/drawers";
import { LastSeenServerChannelsModule } from "@/store/modules/lastSeenServerChannel";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class ChannelTemplate extends Vue {
  @Prop() private channel!: Channel;

  channelClicked() {
    DrawersModule.SetLeftDrawer(false);
    this.$router.push({ params: { channel_id: this.channel.channelID } });
  }
  get notificationExists() {
    return LastSeenServerChannelsModule.serverChannelNotification(
      this.channel.channelID
    );
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
  content-visibility: auto;
  contain-intrinsic-size: 30px;
  border-radius: 4px;
  cursor: pointer;
  transition: 0.1s;
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  &.selected {
    background: var(--primary-color);
    color: white;
    .dot {
      opacity: 1;
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
}
</style>
