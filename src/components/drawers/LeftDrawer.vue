<template>
  <div class="drawer">
    <SideBar />
    <div class="container">
      <div class="header">
        {{ headerName }}
      </div>
      <DirectMessageDrawer v-if="currentTab === 'dms'" />
      <ServerDrawer v-if="currentTab === 'servers'" />
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

const SettingsDrawer = () =>
  import(
    /* webpackChunkName: "SettingsDrawer" */ "@/components/drawers/SettingsDrawer.vue"
  );
const DirectMessageDrawer = () =>
  import(
    /* webpackChunkName: "DirectMessageDrawer" */ "@/components/drawers/DirectMessageDrawer.vue"
  );

import SideBar from "@/components/sidebar/SideBar.vue";

import { ServersModule } from "@/store/modules/servers";

@Component({
  components: { SideBar, ServerDrawer, SettingsDrawer, DirectMessageDrawer }
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
  height: 40px;
  background: rgba(0, 0, 0, 0.3);
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
