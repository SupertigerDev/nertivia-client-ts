<template>
  <div class="side-bar">
    <Servers />
    <div
      class="material-icons add-server-button"
      :title="$t('add-server-popout.title')"
      @click="addServerClicked"
    >
      add
    </div>
  </div>
</template>

<script lang="ts">
import { PopoutsModule } from "@/store/modules/popouts";
import Servers from "./Servers.vue";

import { defineComponent } from "vue";
export default defineComponent({
  name: "SideBar",
  components: { Servers },
  methods: {
    addServerClicked() {
      PopoutsModule.ShowPopout({
        component: "add-server-popout",
        id: "add-server"
      });
    }
  }
});
</script>

<style lang="scss" scoped>
.side-bar {
  display: flex;
  flex-direction: column;
  width: 70px;
  flex-shrink: 0;
}
.add-server-button {
  height: 50px;
  width: 50px;
  align-self: center;
  flex-shrink: 0;
  border-radius: 4px;
  font-size: 30px;
  display: flex;
  align-content: center;
  justify-content: center;
  align-items: center;
  margin-bottom: 3px;
  margin-top: 3px;
  transition: 0.2s;
  user-select: none;
  cursor: pointer;
  &:hover {
    background: var(--primary-color);
  }
}
@media (max-width: 950px) {
  .side-bar {
    padding-bottom: 56px;
  }
}
</style>
