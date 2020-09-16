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
    <AvatarImage
      class="user-area-button"
      size="25px"
      :image-id="me.avatar"
      :seed-id="me.uniqueID"
    />
    <div class="item material-icons" title="Settings">
      settings
    </div>
  </div>
</template>

<script lang="ts">
const AvatarImage = () =>
  import(/* webpackChunkName: "AvatarImage" */ "@/components/AvatarImage.vue");
import { MeModule } from "@/store/modules/me";
import { Component, Vue } from "vue-property-decorator";
interface LastSelectedServer {
  channel_id: string;
  server_id: string;
}
@Component({ components: { AvatarImage } })
export default class MainApp extends Vue {
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
  height: 100%;
  padding-left: 2px;
}
.gap {
  flex: 1;
}
.item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  width: 50px;
  cursor: pointer;
  user-select: none;
  opacity: 0.6;
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
}
.user-area-button {
  transition: 0.2s;
  cursor: pointer;
  &:hover {
    transform: scale(1.1);
  }
}
@media (max-width: 650px) {
  .nav-bar {
    height: 60px;
    width: 100%;
    flex-direction: row;
  }
}
</style>
