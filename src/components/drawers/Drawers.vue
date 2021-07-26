<template>
  <div class="drawer-layout" :class="{ isMobile }">
    <!-- Backdrop -->
    <div class="drawer-backdrop" v-if="showBackDrop" @click="closeAll"></div>
    <!-- Left -->
    <transition name="slide">
      <div
        class="drawer-container left"
        :style="leftStyle"
        :class="{ open: leftOpened }"
      >
        <slot class="drawer" name="drawer-left"></slot>
      </div>
    </transition>
    <!-- Content -->
    <div class="content-wrapper">
      <slot name="content"></slot>
    </div>
    <!-- Right -->
    <transition name="slide-right">
      <div
        class="drawer-container right"
        :style="rightStyle"
        v-if="isMobile || (!isMobile && rightOpened)"
        :class="{ open: rightOpened }"
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
  leftStyle: any = { transform: "0" };
  rightStyle: any = { transform: "0" };
  leftDrawerTouch = false;
  rightDrawerTouch = false;
  startX = 0;
  startY = 0;
  touchStamp = 0;
  pauseTouches = false;
  mounted() {
    DrawersModule.SetRightDrawer(!this.isMobile);
    window.addEventListener("touchstart", this.onTouchStart);
    window.addEventListener("touchmove", this.onTouchMove);
    window.addEventListener("touchend", this.onTouchEnd);
    window.addEventListener("scroll", this.onScroll, true);
  }
  beforeDestroy() {
    window.removeEventListener("touchstart", this.onTouchStart);
    window.removeEventListener("touchmove", this.onTouchMove);
    window.removeEventListener("touchend", this.onTouchEnd);
    window.removeEventListener("scroll", this.onScroll, true);
  }

  onTouchStart(event: TouchEvent) {
    if ((event.target as any).closest(".header-tabs")) {
      this.pauseTouches = true;
      return;
    }
    if ((event.target as any).closest("input[type=range]")) {
      this.pauseTouches = true;
      return;
    }
    if ((event.target as any).closest(".pcr-app")) {
      this.pauseTouches = true;
      return;
    }
    if ((event.target as any).closest(".canvas-container")) {
      this.pauseTouches = true;
      return;
    }
    this.pauseTouches = false;
    if (!this.isMobile) return;

    this.touchStamp = Date.now();
    const x = event.touches[0].clientX;
    const y = event.touches[0].clientY;
    this.startX = x;
    this.startY = y;
    if (!this.rightOpened && !this.leftOpened) return;

    if (this.leftOpened) {
      if (!this.rightOpened) this.leftDrawerTouch = true;
    }
    if (this.rightOpened) {
      if (!this.leftOpened) this.rightDrawerTouch = true;
    }
  }
  onTouchEnd(event: TouchEvent) {
    if (!this.isMobile) return;

    this.pauseTouches = false;
    const x = event.changedTouches[0].clientX;

    const time = Date.now() - this.touchStamp;
    const distance = this.startX - x;

    if (time <= 150) {
      const speed = Math.abs(distance) / time;
      if (speed >= 0.5) {
        if (this.leftDrawerTouch) {
          if (!this.leftOpened && distance < 0) {
            DrawersModule.SetLeftDrawer(true);
            this.leftDrawerTouch = false;
          }
          if (this.leftOpened && distance > 0) {
            DrawersModule.SetLeftDrawer(false);
            this.leftDrawerTouch = false;
          }
        }
        if (this.rightDrawerTouch) {
          if (!this.rightOpened && distance > 0) {
            DrawersModule.SetRightDrawer(true);
            this.rightDrawerTouch = false;
          }
          if (this.rightOpened && distance < 0) {
            DrawersModule.SetRightDrawer(false);
            this.rightDrawerTouch = false;
          }
        }
      }
    }

    if (this.leftDrawerTouch) {
      const xPos = parseInt(this.leftStyle.transform.slice(11, -3));
      const closest = this.closest(xPos, [0, 320]);
      this.leftStyle.transition = "transform 0.2s";

      DrawersModule.SetLeftDrawer(closest !== 0);
      this.onLeftChange();

      this.leftDrawerTouch = false;
      return;
    }
    if (this.rightDrawerTouch) {
      const xPos = parseInt(this.rightStyle.transform.slice(11, -3));
      const closest = this.closest(xPos, [0, -300]);

      DrawersModule.SetRightDrawer(closest === 0);

      this.onRightChange();

      this.rightDrawerTouch = false;
    }
  }
  onTouchMove(event: TouchEvent) {
    if (!this.isMobile) return;
    if (this.pauseTouches) return;

    const x = event.touches[0].clientX;
    const touchDistance = x - this.startX;

    if (!this.leftDrawerTouch && !this.rightDrawerTouch) {
      if (touchDistance < 0) {
        this.leftDrawerTouch = false;
        this.rightDrawerTouch = true;
      } else if (touchDistance > 0) {
        this.leftDrawerTouch = true;
        this.rightDrawerTouch = false;
      }
    }

    if (Math.abs(x - this.startX) <= 20) return;
    if (this.leftDrawerTouch) {
      let newX = x - this.startX + 320;
      if (!this.leftOpened) newX = x - this.startX;
      if (newX >= 320) newX = 320;
      this.leftStyle.transform = "translateX(" + newX + "px" + ")";
      return;
    }
    if (this.rightDrawerTouch) {
      const x = event.touches[0].clientX - 300;
      let newX = x - this.startX;
      if (!this.rightOpened) newX = x - this.startX + 300;
      if (newX <= -300) newX = -300;
      this.rightStyle.transform = "translateX(" + newX + "px" + ")";
    }
  }
  onScroll() {
    this.pauseTouches = true;
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
    DrawersModule.SetRightDrawer(!this.isMobile);

    if (this.isMobile) {
      this.onLeftChange();
    }
    if (this.isMobile) return;
    this.leftStyle.transform = "";
    this.rightStyle.transform = "";
  }
  @Watch("leftOpened")
  onLeftChange() {
    if (!this.isMobile) return;
    this.leftStyle.transition = "transform 0.2s";

    setTimeout(() => {
      this.leftStyle.transition = "";
    }, 200);

    if (this.leftOpened) {
      return (this.leftStyle.transform = "translateX(320px)");
    } else {
      return (this.leftStyle.transform = "translateX(0px)");
    }
  }
  @Watch("rightOpened")
  onRightChange() {
    if (!this.isMobile) return;
    this.rightStyle.transition = "transform 0.2s";

    setTimeout(() => {
      this.rightStyle.transition = "";
    }, 200);

    if (this.rightOpened) {
      return (this.rightStyle.transform = "translateX(-300px)");
    } else {
      return (this.rightStyle.transform = "translateX(0px)");
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
    return DrawersModule.rightDrawer;
  }
  get isMobile() {
    return windowProperties.resizeWidth <= 950;
  }
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
