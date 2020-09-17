<template>
  <div class="nav-bar">
    <div
      class="item material-icons"
      :class="{ selected: currentTab === 'dms' }"
      title="Direct Messages"
      @click="changeTab('dms')"
    >
      forum
    </div>
    <div
      class="item material-icons"
      :class="{ selected: currentTab === 'servers' }"
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
  import(
    /* webpackChunkName: "UserArea" */ "@/components/drawers/UserArea.vue"
  );
import { MeModule } from "@/store/modules/me";
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
    this.showUserArea = false;
  }

  changeTab(name: string) {
    const selectedServer = this.lastSelectedServer();
    let path = name;
    if (this.currentTab === name) return;
    if (name === "servers" && selectedServer) {
      path += `/${selectedServer.server_id}/${selectedServer.channel_id}`;
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
  color: white;
  transition: 0.2s;
  border-radius: 0;
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
