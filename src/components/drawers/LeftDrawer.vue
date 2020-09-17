<template>
  <div class="drawer">
    <SideBar />
    <div class="container">
      <div class="header" v-if="selectedServer">{{ selectedServer.name }}</div>
      <ServerDrawer v-if="selectedServerID" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import SideBar from "@/components/sidebar/SideBar.vue";
import UserArea from "@/components/drawers/UserArea.vue";
import ServerDrawer from "@/components/drawers/ServerDrawer.vue";
import { ServersModule } from "@/store/modules/servers";

@Component({ components: { SideBar, UserArea, ServerDrawer } })
export default class MainApp extends Vue {
  get selectedServerID() {
    return this.$route.params.server_id;
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
