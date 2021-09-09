<template>
  <router-link
    :to="path"
    class="server"
    :class="{
      selected: isServerSelected,
      notification: serverNotificationArr.length,
      mentioned: mentionedNotificationExists
    }"
    @contextmenu.prevent="showContext"
    @mouseover="hover = true"
    @mouseout="hover = false"
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
import AvatarImage from "@/components/AvatarImage.vue";
import Server from "@/interfaces/Server";
import { LastSeenServerChannelsModule } from "@/store/modules/lastSeenServerChannel";
import { PopoutsModule } from "@/store/modules/popouts";
import { LastSelectedServersModule } from "@/store/modules/lastSelectedServer";
import Vue, { PropType } from "vue";
import { defineComponent } from "vue";
export default defineComponent({
  name: "MainApp",
  components: { AvatarImage },
  props: {
    server: {
      type: Object as PropType<Server>,
      required: true
    }
  },
  data() {
    return {
      hover: false
    };
  },
  computed: {
    path(): any {
      const serverChannelID = LastSelectedServersModule.lastServerChannelID(
        this.server.server_id || ""
      );
      return `/app/servers/${this.server.server_id}/${serverChannelID ||
        this.server.default_channel_id}`;
    },
    mentionedNotificationExists(): any {
      return this.serverNotificationArr.find(c => c.mentioned);
    },
    serverNotificationArr(): any {
      return LastSeenServerChannelsModule.serverNotifications(
        this.server.server_id
      );
    },
    isServerSelected(): any {
      return this.$route.params.server_id === this.server.server_id;
    }
  },
  methods: {
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
  }
});
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
    left: 0;
    top: 18px;
    bottom: 18px;
    width: 4px;
    transition: 0.1s;
    border-radius: 4px;
  }
  &:hover::after {
    background: var(--primary-color);
    opacity: 0.7;
  }
  &.selected::after {
    background: var(--primary-color);
    opacity: 1;
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
    color: white;
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
