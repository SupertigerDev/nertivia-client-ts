<template>
  <div
    class="context"
    :style="clampPos"
    v-click-outside="clickOutside"
    @contextmenu.prevent
  >
    <div class="content">
      <div
        :class="{ seperator: item.type === 'seperator', item: !item.type }"
        v-for="(item, i) in items"
        :key="i"
      >
        <div class="icon material-icons" v-if="item.icon && !item.type">
          {{ item.icon }}
        </div>
        <div class="name" v-if="!item.type">{{ item.name }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import windowProperties from "@/utils/windowProperties";

interface ItemsProp {
  name: string;
}
@Component
export default class extends Vue {
  @Prop() private pos!: { x?: number; y?: number };
  @Prop() private items!: ItemsProp[];
  height = 0;
  width = 0;
  clickOutside() {
    this.$emit("close");
  }
  mounted() {
    this.height = this.$el.clientHeight;
    this.width = this.$el.clientWidth;
  }
  get clampPos() {
    const top = this.pos.y || 0;
    const left = this.pos.x || 0;

    // prevent from going bottom of the screen
    const heightPos = this.height + top;
    const clampedTop =
      this.clamp(heightPos, 0, this.windowDiamentions.height) - this.height;
    // prevent from going right of the screen
    const widthPos = this.width + left;
    const clampedLeft =
      this.clamp(widthPos, 0, this.windowDiamentions.width) - this.width;

    return {
      top: clampedTop + "px",
      left: clampedLeft + "px"
    };
  }
  get windowDiamentions() {
    return {
      height: windowProperties.resizeHeight,
      width: windowProperties.resizeWidth
    };
  }
  clamp(num: number, min: number, max: number) {
    return num <= min ? min : num >= max ? max : num;
  }
}
</script>

<style scoped></style>

<style lang="scss" scoped>
.context {
  pointer-events: all;
  background: var(--context-menu-bg-color);
  position: absolute;
  border-radius: 4px;
  overflow: hidden;
}
.content {
  opacity: 0;
  animation: showUp 0.2s;
  animation-fill-mode: forwards;
}
@keyframes showUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.item {
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  user-select: none;
  transition: 0.2s;
  padding: 8px;
  padding-top: 5px;
  padding-bottom: 5px;
  display: flex;
  align-content: center;
  align-items: center;
  &:hover {
    background: var(--primary-color);
    color: white;
  }
  &:active {
    transform: scale(0.9);
  }
}
.name {
  margin-left: 5px;
}
.seperator {
  width: 100%;
  height: 1px;
  background: rgba(255, 255, 255, 0.2);
  margin-top: 2px;
  margin-bottom: 2px;
}
.icon {
  font-size: 21px;
}
</style>
