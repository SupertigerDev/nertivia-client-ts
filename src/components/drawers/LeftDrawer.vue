<template>
  <div class="drawer">
    <SideBar />
    <div class="container">
      <div class="header" :class="{ hasIcon: selectedServer }">
        <div class="title">{{ headerName }}</div>
        <div
          class="material-icons verified"
          title="Verified"
          v-if="selectedServer && selectedServer.verified"
        >
          done
        </div>
        <div
          class="material-icons icon"
          @click="showServerContext"
          v-if="selectedServer"
        >
          more_horiz
        </div>
      </div>
      <DirectMessageDrawer v-if="currentTab === 'dms'" />
      <ServerDrawer v-if="showServerDrawer" :key="selectedServerID" />
      <ServerSettingsDrawer v-if="showServerSettingsDrawer" />
      <SettingsDrawer v-if="currentTab === 'settings'" />
      <ExploreDrawer v-if="currentTab === 'explore'" />
      <AdminPanelDrawer v-if="currentTab === 'admin-panel'" />
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
const ExploreDrawer = () =>
  import(
    /* webpackChunkName: "ExploreDrawer" */ "@/components/drawers/ExploreDrawer.vue"
  );
const AdminPanelDrawer = () =>
  import(
    /* webpackChunkName: "AdminPanelDrawer" */ "@/components/drawers/AdminPanelDrawer.vue"
  );

import SideBar from "@/components/sidebar/SideBar.vue";

import { ServersModule } from "@/store/modules/servers";
import { PopoutsModule } from "@/store/modules/popouts";

@Component({
  components: {
    SideBar,
    ServerDrawer,
    SettingsDrawer,
    DirectMessageDrawer,
    ServerSettingsDrawer,
    ExploreDrawer,
    AdminPanelDrawer
  }
})
export default class MainApp extends Vue {
  showServerContext(event: any) {
    PopoutsModule.ShowPopout({
      id: "context",
      component: "ServerContextMenu",
      key: this.selectedServerID + event.clientX + event.clientY,
      data: {
        x: event.clientX,
        y: event.clientY,
        server_id: this.selectedServerID
      }
    });
  }
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
  get showServerSettingsDrawer() {
    return this.$route.name === "server-settings";
  }
  get showServerDrawer() {
    return this.currentTab === "servers" && !this.showServerSettingsDrawer;
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
  max-width: 320px;
  flex-shrink: 0;
}
.container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background: var(--drawer-bg-color);
  overflow: hidden;
}
.header {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  height: 40px;
  background-color: var(--side-header-bg-color);

  .title {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: center;
    width: 100%;
  }
  .verified {
    background: rgba(0, 0, 0, 0.4);
    padding: 3px;
    font-size: 14px;
    border-radius: 50%;
    cursor: default;
    user-select: none;
    flex-shrink: 0;
  }
  &.hasIcon .title {
    width: initial;
    text-align: start;
    margin: 10px;
    margin-right: 5px;
  }
  .icon {
    flex-shrink: 0;
    margin-left: auto;
    margin-right: 10px;
    cursor: pointer;
    opacity: 0.8;
    transition: 0.2s;
    &:hover {
      opacity: 1;
    }
  }
}
@media (max-width: 950px) {
  .drawer {
    background: var(--background-color);
    // width: 320px;
  }
}
</style>
