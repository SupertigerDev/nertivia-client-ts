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
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
interface LastSelectedServer {
  channel_id: string;
  server_id: string;
}
@Component
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
}
</script>

<style lang="scss" scoped>
.nav-bar {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  height: 40px;
}
.item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  width: 71px;
  cursor: pointer;
  user-select: none;
  opacity: 0.6;
  color: white;
  transition: 0.2s;
  &:hover {
    opacity: 1;
  }
  &.selected {
    opacity: 1;
    background-color: var(--primary-color);
    border-radius: 4px;
  }
}
</style>
