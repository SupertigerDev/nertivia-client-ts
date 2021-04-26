<template>
  <router-link
    :to="path"
    class="server"
    :class="{
      selected: isServerSelected,
      notification: serverNotificationArr.length,
      mentioned: mentionedNotificationExists
    }"
    @contextmenu.prevent.native="showContext"
    @mouseover.native="hover = true"
    @mouseout.native="hover = false"
  >
    <AvatarImage
      size="50px"
      :imageId="server.avatar"
      :seedId="server.server_id"
      :animateGif="hover"
    />
  </router-link>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import AvatarImage from "@/components/AvatarImage.vue";
import Server from "@/interfaces/Server";
import { LastSeenServerChannelsModule } from "@/store/modules/lastSeenServerChannel";
import { PopoutsModule } from "@/store/modules/popouts";
import { LastSelectedServersModule } from "@/store/modules/lastSelectedServer";

@Component({ components: { AvatarImage } })
export default class MainApp extends Vue {
  @Prop() private server!: Server;
  hover = false;

  showContext(event: MouseEvent) {
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
  get path() {
    const serverChannelID = LastSelectedServersModule.lastServerChannelID(
      this.server.server_id || ""
    );
    return `/app/servers/${this.server.server_id}/${serverChannelID ||
      this.server.default_channel_id}`;
  }
  get mentionedNotificationExists() {
    return this.serverNotificationArr.find(c => c.mentioned);
  }
  get serverNotificationArr() {
    return LastSeenServerChannelsModule.serverNotifications(
      this.server.server_id
    );
  }

  get isServerSelected() {
    return this.$route.params.server_id === this.server.server_id;
  }
}
</script>

<style lang="scss" scoped>
.server {
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
  width: 70px;
  height: 60px;
  content-visibility: auto;
  contain-intrinsic-size: 60px;
  user-select: none;
  cursor: pointer;

  &::after {
    content: "";
    position: absolute;
    top: 20px;
    bottom: 20px;
    left: 0;
    transition: 0.1s;
    width: 2px;
  }
  &.selected::after {
    background: var(--primary-color);
    opacity: 1;
    top: 10px;
    width: 3px;
    bottom: 10px;
  }
  &:hover::after {
    background: var(--primary-color);
    opacity: 0.7;
  }

  &.notification::after {
    background: var(--alert-color);
    opacity: 1;
  }

  &.notification.mentioned::before {
    content: "@";
    position: absolute;
    align-items: center;
    align-content: center;
    justify-content: center;
    display: flex;
    font-size: 12px;
    z-index: 1;
    bottom: 2px;
    right: 10px;
    transition: 0.1s;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: var(--alert-color);
  }
}
</style>
