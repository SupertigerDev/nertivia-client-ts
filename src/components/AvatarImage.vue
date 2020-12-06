<template>
  <div class="avatar">
    <div class="image" :style="style" :class="{ willHaveClickEvent }">
      <img src="@/assets/profile-logo.png" v-if="!imageId" />
      <img v-else :style="style" :src="src" :class="{ willHaveClickEvent }" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

import { seededColor } from "seeded-color";
import config from "@/config";
import WindowProperties from "@/utils/windowProperties";

@Component
export default class MainApp extends Vue {
  @Prop() private size!: string;
  @Prop() private imageId!: string;
  @Prop() private seedId!: string;
  @Prop() private willHaveClickEvent!: boolean;
  @Prop() private animateGif!: boolean;

  get src() {
    let url = config.nertiviaCDN + this.imageId;
    if (!this.isGif) return url;
    if (!this.animateGif || !this.isFocused) {
      url += "?type=webp";
    }
    return url;
  }
  get isFocused() {
    return WindowProperties.isFocused;
  }
  get isGif() {
    return this.imageId.endsWith(".gif");
  }
  get bgColor() {
    return seededColor(this.seedId || "owo");
  }
  get style() {
    let style = `width:${this.size};height:${this.size};`;
    // Add seed background color if no image.
    if (!this.imageId) {
      style += "background-color:" + this.bgColor;
    }
    return style;
  }
}
</script>

<style lang="scss" scoped>
.image {
  display: flex;
  flex-shrink: 0;
  user-select: none;
  position: relative;
  border-radius: 50%;
  overflow: hidden;
}
img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.willHaveClickEvent {
  cursor: pointer;
  &:before {
    content: "";
    transition: 0.2s;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0);
    bottom: 0;
    z-index: 999;
  }
  &:hover:before {
    background: rgba(0, 0, 0, 0.4);
  }
}
</style>
