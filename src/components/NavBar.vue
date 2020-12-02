<template>
  <div class="nav-bar">
    <div
      class="item material-icons"
      :class="{
        selected: currentTab === 'explore'
      }"
      title="Explore"
      @click="changeTab('explore')"
    >
      explore
    </div>
    <div
      class="item material-icons"
      :class="{
        selected: currentTab === 'dms',
        notification: dmNotificationExists
      }"
      title="Direct Messages"
      @click="changeTab('dms')"
    >
      forum
    </div>
    <div
      class="item material-icons"
      :class="{
        selected: currentTab === 'servers',
        notification: serverNotificationExists,
        mentioned: serverMentioned
      }"
      title="Servers"
      @click="changeTab('servers')"
    >
      dns
    </div>
    <div class="gap" />
    <div
      class="item me"
      :class="{ selected: showUserArea }"
      :title="me.username"
      @click="showUserArea = !showUserArea"
    >
      <AvatarImage
        class="avatar"
        size="25px"
        :image-id="me.avatar"
        :seed-id="me.uniqueID"
      />
    </div>
    <div
      class="item material-icons"
      title="Settings"
      :class="{ selected: currentTab === 'settings' }"
      @click="changeTab('settings')"
    >
      settings
    </div>
    <!-- Popouts -->
    <UserArea
      class="user-area"
      v-if="showUserArea"
      v-click-outside="clickOutsideUserArea"
    />
  </div>
</template>

<script lang="ts">
const AvatarImage = () =>
  import(/* webpackChunkName: "AvatarImage" */ "@/components/AvatarImage.vue");
const UserArea = () =>
  import(/* webpackChunkName: "UserArea" */ "@/components/UserArea.vue");
import { LastSeenServerChannelsModule } from "@/store/modules/lastSeenServerChannel";
import { MeModule } from "@/store/modules/me";
import { NotificationsModule } from "@/store/modules/notifications";
import { Component, Vue } from "vue-property-decorator";
interface LastSelectedServer {
  channel_id: string;
  server_id: string;
}
@Component({ components: { AvatarImage, UserArea } })
export default class MainApp extends Vue {
  showUserArea = false;
  clickOutsideUserArea(event: any) {
    if (event.target.closest(".item.me")) return;
    if (event.target.closest(".context")) return;
    this.showUserArea = false;
  }

  changeTab(name: string) {
    const selectedServer = this.lastSelectedServer();
    const selectedDmChannelId = this.lastSelectedDMChannelID();
    let path = name;
    if (this.currentTab === name) return;
    if (name === "servers" && selectedServer && selectedServer.server_id) {
      path += `/${selectedServer.server_id}/${selectedServer.channel_id}`;
    }
    if (name === "dms" && selectedDmChannelId) {
      path += `/${selectedDmChannelId}`;
    }
    this.$router.push("/app/" + path);
  }
  lastSelectedServer(): LastSelectedServer | null {
    return JSON.parse(localStorage.getItem("lastSelectedServer") || "null");
  }
  lastSelectedDMChannelID(): string | null {
    return localStorage.getItem("lastSelectedDMChannelID");
  }
  get currentTab() {
    return this.$route.path.split("/")[2];
  }
  get me() {
    return MeModule.user;
  }
  get serverMentioned() {
    return LastSeenServerChannelsModule.allServerNotifications.find(
      c => c.mentioned
    );
  }
  get serverNotificationExists() {
    return LastSeenServerChannelsModule.allServerNotifications.length > 0;
  }
  get dmNotificationExists() {
    return NotificationsModule.allDMNotifications.length > 0;
  }
}
</script>

<style lang="scss" scoped>
.nav-bar {
  display: flex;
  flex-direction: column;
  width: 60px;
  align-items: center;
  flex-shrink: 0;
  padding-top: 4px;
  padding-bottom: 4px;
}
.gap {
  flex: 1;
}
.item {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  height: 50px;
  width: 50px;
  cursor: pointer;
  user-select: none;
  opacity: 0.6;
  z-index: 1111111;
  transition: 0.2s;
  border-radius: 0;
  position: relative;
  &:hover {
    opacity: 1;
  }
  &.selected {
    border-radius: 4px;
    opacity: 1;
    background-color: var(--primary-color);
  }
  &.me.selected {
    background-color: transparent;
    transform: scale(1.5);
  }
  &.notification {
    &::before {
      content: "a";
      color: white;
      position: absolute;
      bottom: 10px;
      right: 13px;
      background-color: var(--alert-color);
      border-radius: 50%;
      height: 10px;
      width: 10px;
    }
    &.mentioned::before {
      content: "@";
      display: flex;
      font-family: Avenir, Helvetica, Arial, sans-serif;
      color: white;
      align-items: center;
      align-content: center;
      justify-content: center;
      font-size: 12px;
      width: 20px;
      height: 20px;
      bottom: 5px;
      right: 10px;
    }
  }
}
.user-area-button {
  opacity: 1;
  transition: 0.2s;
  cursor: pointer;
  &:hover {
    transform: scale(1.1);
  }
}
.user-area {
  position: absolute;
  left: 60px;
  bottom: 53px;
  z-index: 11111112111;
}
@media (max-width: 650px) {
  .nav-bar {
    height: 60px;
    width: 100%;
    flex-direction: row;
    padding-top: 0;
    padding-bottom: 0;
  }
  .item:nth-child(1) {
    margin-left: 4px;
  }
  .item:last-child {
    margin-right: 4px;
  }
  .user-area {
    bottom: 60px;
    right: 5px;
    left: initial;
  }
}
</style>
