<template>
  <div class="drawer-layout" :class="{ isMobile }">
    <!-- Backdrop -->
    <div class="drawer-backdrop" v-if="showBackDrop" @click="closeAll"></div>
    <!-- Left -->
    <transition name="slide">
      <div class="drawer-container left" :class="{ open: leftOpened }">
        <slot class="drawer" name="drawer-left"></slot>
      </div>
    </transition>
    <!-- Content -->
    <div class="content-wrapper">
      <slot name="content"></slot>
    </div>
    <!-- Right -->
    <transition name="slide-right">
      <div class="drawer-container right" :class="{ open: rightOpened }">
        <slot name="drawer-right"></slot>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import windowProperties from "@/utils/windowProperties";
import { DrawersModule } from "@/store/modules/drawers";
import { PopoutsModule } from "@/store/modules/popouts";

@Component
export default class MainApp extends Vue {
  closeAll() {
    this.closeLeft();
    this.closeRight();
  }

  closeLeft() {
    DrawersModule.SetLeftDrawer(false);
  }
  closeRight() {
    DrawersModule.SetRightDrawer(false);
  }

  get showBackDrop() {
    if (!this.isMobile) return false;
    return this.leftOpened || this.rightOpened;
  }

  get leftOpened() {
    if (!this.isMobile) return true;
    return DrawersModule.leftDrawer;
  }
  get rightOpened() {
    if (!this.isMobile) return true;
    return DrawersModule.rightDrawer;
  }
  get isMobile() {
    return windowProperties.resizeWidth <= 950;
  }

  // closeAllDrawers() {
  //   if (Object.keys(PopoutsModule.popouts).length) return;
  //   DrawersModule.SetLeftDrawer(false);
  //   DrawersModule.SetRightDrawer(false);
  // }

  // @Watch("windowWidth")
  // CloseDrawerWhenDesktop() {
  //   if (this.openRightDrawer && this.windowWidth >= 950) {
  //     DrawersModule.SetRightDrawer(false);
  //   }
  //   if (this.openLeftDrawer && this.windowWidth >= 650) {
  //     DrawersModule.SetLeftDrawer(false);
  //   }
  // }

  // get openLeftDrawer() {
  //   return DrawersModule.leftDrawer;
  // }
  // get openRightDrawer() {
  //   return DrawersModule.rightDrawer;
  // }

  // get windowWidth() {
  //   return windowProperties.resizeWidth;
  // }
  // get closeRightDrawer() {
  //   return this.windowWidth <= 950 && !this.openRightDrawer;
  // }
  // get closeLeftDrawer() {
  //   return this.windowWidth <= 650 && !this.openLeftDrawer;
  // }
}
</script>

<style lang="scss" scoped>
.content-wrapper {
  display: flex;
  overflow: hidden;
  flex: 1;
  z-index: 11;
}
.drawer-backdrop {
  background-color: rgba(0, 0, 0, 0.5);
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 99999;
}

.drawer-layout {
  display: flex;
  height: 100%;
  width: 100%;
  overflow: hidden;
  position: relative;
  min-height: 0;
  .drawer-container {
    background: var(--drawer-bg-color);
    z-index: 999;
    &.left {
      background: transparent;
    }
  }
  &.isMobile {
    .drawer-container {
      position: absolute;
      top: 0;
      bottom: 0;
      overflow: hidden;
      height: 100%;
      z-index: 99999;
      z-index: 99999;
      transition: transform 0.2s;
      &.left {
        left: -320px;
        &.open {
          transform: translateX(320px);
        }
      }
      &.right {
        right: -300px;
        &.open {
          transform: translateX(-300px);
        }
      }
    }
  }
}
</style>
