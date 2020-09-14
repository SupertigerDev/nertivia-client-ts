<template>
  <div class="drawer-layout">
    <div
      class="drawer-backdrop"
      v-if="openLeftDrawer || openRightDrawer"
      @click="closeAllDrawers"
    ></div>
    <transition name="slide">
      <div
        class="drawer-wrapper left"
        :class="{ mobile: openLeftDrawer }"
        v-if="!closeLeftDrawer"
      >
        <slot class="drawer" name="drawer-left"></slot>
      </div>
    </transition>
    <div class="content-wrapper">
      <slot name="content"></slot>
    </div>
    <transition name="slide-right">
      <div
        class="drawer-wrapper right"
        v-if="!closeRightDrawer"
        :class="{ mobile: openRightDrawer }"
      >
        <slot name="drawer-right"></slot>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import windowProperties from "@/utils/windowProperties";
import { DrawersModule } from "@/store/modules/drawers";

@Component
export default class MainApp extends Vue {
  closeAllDrawers() {
    DrawersModule.SetLeftDrawer(false);
    DrawersModule.SetRightDrawer(false);
  }

  @Watch("windowWidth")
  CloseDrawerWhenDesktop() {
    if (this.openRightDrawer && this.windowWidth >= 950) {
      DrawersModule.SetRightDrawer(false);
    }
    if (this.openLeftDrawer && this.windowWidth >= 650) {
      DrawersModule.SetLeftDrawer(false);
    }
  }

  get openLeftDrawer() {
    return DrawersModule.leftDrawer;
  }
  get openRightDrawer() {
    return DrawersModule.rightDrawer;
  }

  get windowWidth() {
    return windowProperties.resizeWidth;
  }
  get closeRightDrawer() {
    return this.windowWidth <= 950 && !this.openRightDrawer;
  }
  get closeLeftDrawer() {
    return this.windowWidth <= 650 && !this.openLeftDrawer;
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/global.scss";
// Drawer Left
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.2s ease;
}

.slide-enter,
.slide-leave-to {
  transform: translateX(-100%);
  transition: all 150ms ease-in 0s;
}
.slide-move {
  transition: transform 1s;
}

// Drawer Right
.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.2s ease;
}

.slide-right-enter,
.slide-right-leave-to {
  transform: translateX(100%);
  transition: all 150ms ease-in 0s;
}

.drawer-backdrop {
  background-color: rgba(0, 0, 0, 0.5);
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 99;
}

.drawer-layout {
  display: flex;
  height: 100%;
  width: 100%;
  position: relative;
  min-height: 0;
}
.content-wrapper {
  display: flex;
  width: 100%;
  flex: 1;
}
.drawer-wrapper {
  background: $drawer-bg-color;
  width: 300px;
  flex-shrink: 0;
  z-index: 999;
  &.left {
    width: 320px;
    background: transparent;
  }

  &.mobile {
    position: absolute;
    left: 0;
    overflow: hidden;
    top: 0;
    bottom: 0;
    height: 100%;
    z-index: 999;
  }
  &.right.mobile {
    left: initial;
    right: 0;
  }
}
</style>
