<template>
  <div class="drawer">
    <SideBar />
    <div class="container">
      <UserArea />
      <ServerDrawer v-if="selectedServerID" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import SideBar from "@/components/sidebar/SideBar.vue";
import UserArea from "@/components/drawers/UserArea.vue";
import ServerDrawer from "@/components/drawers/ServerDrawer.vue";

@Component({ components: { SideBar, UserArea, ServerDrawer } })
export default class MainApp extends Vue {
  get selectedServerID() {
    return this.$route.params.server_id;
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
  border-top-left-radius: 10px;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.5);
}
@media (max-width: 650px) {
  .container {
    border-top-left-radius: 0px;
    border-bottom-left-radius: 10px;
  }
  .drawer {
    background: var(--background-color);
  }
}
</style>
