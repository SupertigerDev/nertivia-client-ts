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
  leftDrawerTouch = false;
  leftDrawerEl: HTMLElement | null = null;
  rightDrawerTouch = false;
  rightDrawerEl: HTMLElement | null = null;
  startX = 0;
  startY = 0;
  mounted() {
    window.addEventListener("touchstart", this.onTouchStart);
    window.addEventListener("touchmove", this.onTouchMove);
    window.addEventListener("touchend", this.onTouchEnd);
    window.addEventListener("scroll", this.onScroll, true);
    this.leftDrawerEl = document.querySelector(".drawer-container.left");
    this.rightDrawerEl = document.querySelector(".drawer-container.right");
  }
  beforeDestroy() {
    window.removeEventListener("touchstart", this.onTouchStart);
    window.removeEventListener("touchmove", this.onTouchMove);
    window.removeEventListener("touchend", this.onTouchEnd);
    window.removeEventListener("scroll", this.onScroll, true);
  }

  onTouchStart(event: TouchEvent) {
    const minimumZone = 10;
    const x = event.touches[0].clientX;
    const y = event.touches[0].clientY;
    this.startX = x;
    this.startY = y;
    if (x <= minimumZone || this.leftOpened) {
      if (!this.rightOpened) this.leftDrawerTouch = true;
    }
    if (window.innerWidth - x <= minimumZone || this.rightOpened) {
      if (!this.leftOpened) this.rightDrawerTouch = true;
    }
  }
  onTouchEnd(event?: TouchEvent) {
    if (this.leftDrawerTouch) {
      if (!this.leftDrawerEl) return;
      const xPos = parseInt(this.leftDrawerEl.style.transform.slice(11, -3));
      const closest = this.closest(xPos, [0, 320]);
      this.leftDrawerEl.style.transition = "transform 0.2s";

      DrawersModule.SetLeftDrawer(closest !== 0);
      this.onLeftChange();

      setTimeout(() => {
        if (!this.leftDrawerEl) return;
        this.leftDrawerEl.style.transition = "";
      }, 200);

      this.leftDrawerTouch = false;
      return;
    }
    if (this.rightDrawerTouch) {
      if (!this.rightDrawerEl) return;
      const xPos = parseInt(this.rightDrawerEl.style.transform.slice(11, -3));
      const closest = this.closest(xPos, [0, -300]);

      DrawersModule.SetRightDrawer(closest === 0);

      this.onRightChange();

      this.rightDrawerTouch = false;
    }
  }
  onTouchMove(event: TouchEvent) {
    if (!this.leftDrawerEl) return;
    if (!this.rightDrawerEl) return;
    if (this.leftDrawerTouch) {
      const x = event.touches[0].clientX;
      const y = event.touches[0].clientY;
      if (Math.abs(x - this.startX) <= 20) return;
      let newX = x - this.startX + 320;
      if (!this.leftOpened) newX = x;
      if (newX >= 320) newX = 320;
      this.leftDrawerEl.style.transform = "translateX(" + newX + "px" + ")";
      return;
    }
    if (this.rightDrawerTouch) {
      const x = event.touches[0].clientX - 300;
      const y = event.touches[0].clientY;
      if (Math.abs(x - this.startX) <= 20) return;
      let newX = x - this.startX;
      if (!this.rightOpened) newX = x - this.startX + 300;
      if (newX <= -300) newX = -300;
      this.rightDrawerEl.style.transform = "translateX(" + newX + "px" + ")";
    }
  }
  onScroll() {
    this.onTouchEnd();
  }
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
  openLeft() {
    DrawersModule.SetLeftDrawer(true);
  }
  openRight() {
    DrawersModule.SetRightDrawer(true);
  }

  closest(num, arr) {
    let mid;
    let lo = 0;
    let hi = arr.length - 1;
    while (hi - lo > 1) {
      mid = Math.floor((lo + hi) / 2);
      if (arr[mid] < num) {
        lo = mid;
      } else {
        hi = mid;
      }
    }
    if (num - arr[lo] <= arr[hi] - num) {
      return arr[lo];
    }
    return arr[hi];
  }

  @Watch("isMobile")
  onMobileChange() {
    if (!this.leftDrawerEl) return;
    if (!this.rightDrawerEl) return;
    if (this.isMobile) {
      this.onLeftChange();
    }
    if (this.isMobile) return;
    this.leftDrawerEl.style.transform = "";
    this.rightDrawerEl.style.transform = "";
  }
  @Watch("leftOpened")
  onLeftChange() {
    if (!this.isMobile) return;
    if (!this.leftDrawerEl) return;
    this.leftDrawerEl.style.transition = "transform 0.2s";

    setTimeout(() => {
      if (!this.leftDrawerEl) return;
      this.leftDrawerEl.style.transition = "";
    }, 200);

    if (this.leftOpened) {
      return (this.leftDrawerEl.style.transform = "translateX(320px)");
    } else {
      return (this.leftDrawerEl.style.transform = "translateX(0px)");
    }
  }
  @Watch("rightOpened")
  onRightChange() {
    if (!this.isMobile) return;
    if (!this.rightDrawerEl) return;
    this.rightDrawerEl.style.transition = "transform 0.2s";

    setTimeout(() => {
      if (!this.rightDrawerEl) return;
      this.rightDrawerEl.style.transition = "";
    }, 200);

    if (this.rightOpened) {
      return (this.rightDrawerEl.style.transform = "translateX(-300px)");
    } else {
      return (this.rightDrawerEl.style.transform = "translateX(0px)");
    }
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
      &.left {
        left: -320px;
        // &.open {
        //   transform: translateX(320px);
        // }
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
