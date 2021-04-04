<template>
  <div class="header">
    <div
      class="open-drawer-button left-drawer material-icons"
      @click="toggleLeftDrawer"
    >
      menu
    </div>
    <div class="name">{{ title }}</div>
    <div
      class="open-drawer-button right-drawer material-icons"
      v-if="isServerChannel"
      @click="toggleRightDrawer"
    >
      menu
    </div>
  </div>
</template>

<script lang="ts">
import { DrawersModule } from "@/store/modules/drawers";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class MainApp extends Vue {
  @Prop() private title!: string;
  toggleLeftDrawer() {
    DrawersModule.SetLeftDrawer(true);
  }
  toggleRightDrawer() {
    DrawersModule.SetRightDrawer(true);
  }
  get isServerChannel() {
    return this.$route.params.server_id;
  }
}
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  align-content: center;
  align-items: center;
  height: 40px;
  width: 100%;
  flex-shrink: 0;
  background-color: var(--main-header-bg-color);
}
.name {
  margin-left: 10px;
}
.open-drawer-button {
  opacity: 0.7;
  transition: 0.2s;
  cursor: pointer;
  display: none;
  &:hover {
    opacity: 1;
  }
}
@media (max-width: 950px) {
  .left-drawer {
    margin-left: 5px;
    display: block;
  }
}
@media (max-width: 950px) {
  .right-drawer {
    margin-right: 5px;
    margin-left: auto;
    display: block;
  }
}
</style>
