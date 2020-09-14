<template>
  <div class="avatar">
    <div class="image" v-if="!imageId" :style="style">
      <img loading="lazy" src="@/assets/profile-logo.png" />
    </div>
    <img loading="lazy" class="image" v-else :style="style" :src="src" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

import seedColor from "seed-color";

@Component
export default class MainApp extends Vue {
  @Prop() private size!: string;
  @Prop() private imageId!: string;
  @Prop() private seedId!: string;
  @Prop() private animateGif!: boolean;

  get src() {
    let url = "https://media.nertivia.tk/" + this.imageId;
    if (!this.isGif) return url;
    if (!this.animateGif) {
      url += "?type=webp";
    }
    return url;
  }
  get isGif() {
    return this.imageId.endsWith(".gif");
  }
  get bgColor() {
    return seedColor(this.seedId).toHex();
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
  border-radius: 50%;
}
img {
  width: 100%;
  height: 100%;
}
</style>
