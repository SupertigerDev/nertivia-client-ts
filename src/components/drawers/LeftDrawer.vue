<template>
  <div class="drawer">
    <SideBar />
    <div class="container">
      <div class="header">
        {{ headerName }}
      </div>
      <DirectMessageDrawer v-if="currentTab === 'dms'" />
      <ServerDrawer
        v-if="currentTab === 'servers' && !showServerSettings"
        :key="selectedServerID"
      />
      <ServerSettingsDrawer v-if="showServerSettings" />
      <SettingsDrawer v-if="currentTab === 'settings'" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import _ from "lodash";

const ServerDrawer = () =>
  import(
    /* webpackChunkName: "ServerDrawer" */ "@/components/drawers/server-drawer/ServerDrawer.vue"
  );
const ServerSettingsDrawer = () =>
  import(
    /* webpackChunkName: "ServerSettingsDrawer" */ "@/components/drawers/server-drawer/ServerSettingsDrawer.vue"
  );

const SettingsDrawer = () =>
  import(
    /* webpackChunkName: "SettingsDrawer" */ "@/components/drawers/SettingsDrawer.vue"
  );
const DirectMessageDrawer = () =>
  import(
    /* webpackChunkName: "DirectMessageDrawer" */ "@/components/drawers/direct-message-drawer/DirectMessageDrawer.vue"
  );

import SideBar from "@/components/sidebar/SideBar.vue";

import { ServersModule } from "@/store/modules/servers";

@Component({
  components: {
    SideBar,
    ServerDrawer,
    SettingsDrawer,
    DirectMessageDrawer,
    ServerSettingsDrawer
  }
})
export default class MainApp extends Vue {
  get headerName() {
    if (this.selectedServer) {
      return this.selectedServer.name;
    }
    return _.capitalize(this.currentTab);
  }
  get selectedServerID() {
    return this.$route.params.server_id;
  }
  get currentTab() {
    return this.$route.path.split("/")[2];
  }
  get showServerSettings() {
    return this.$route.name === "server-settings";
  }
  get selectedServer() {
    return ServersModule.servers[this.selectedServerID];
  }
}
</script>

<style lang="scss" scoped>
.drawer {
  display: flex;
  height: 100%;
}
.container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background: var(--drawer-bg-color);
  border-top-left-radius: 4px;
  overflow: hidden;
}
.header {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  height: 40px;
  background-color: var(--side-header-bg-color);
}
@media (max-width: 650px) {
  .container {
    border-top-left-radius: 0px;
    border-bottom-left-radius: 4px;
  }
  .drawer {
    background: var(--background-color);
  }
}
</style>
