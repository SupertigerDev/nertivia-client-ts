<template>
  <div
    class="server"
    :class="{
      selected: isServerSelected,
      notification: serverNotificationArr.length,
      mentioned: mentionedNotificationExists
    }"
    @contextmenu.prevent="showContext"
    @click="serverClicked"
    @mouseover="hover = true"
    @mouseout="hover = false"
  >
    <AvatarImage
      size="50px"
      :imageId="server.avatar"
      :seedId="server.server_id"
      :animateGif="hover"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import AvatarImage from "@/components/AvatarImage.vue";
import Server from "@/interfaces/Server";
import { LastSeenServerChannelsModule } from "@/store/modules/lastSeenServerChannel";
import { PopoutsModule } from "@/store/modules/popouts";

@Component({ components: { AvatarImage } })
export default class MainApp extends Vue {
  @Prop() private server!: Server;
  hover = false;

  serverClicked() {
    this.$router.push(
      `/app/servers/${this.server.server_id}/${this.server.default_channel_id}`
    );
  }
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
