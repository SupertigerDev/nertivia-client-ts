<template>
  <div class="avatar">
    <div class="image" :style="style" :class="{ willHaveClickEvent }">
      <div
        class="inner-image"
        :style="{ backgroundColor: bgColor }"
        :class="{ willHaveClickEvent }"
      >
        <img :src="customUrl" v-if="customUrl" />
        <img src="@/assets/profile-logo.png" v-else-if="!imageId" />
        <img v-else :style="style" :src="src" :class="{ willHaveClickEvent }" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { seededColor } from "seeded-color";
import WindowProperties from "@/utils/windowProperties";
import { highPriorityBadge } from "@/constants/badges";

@Component
export default class MainApp extends Vue {
  @Prop() private size!: string;
  @Prop() private imageId!: string;
  @Prop() private seedId!: string;
  @Prop() private willHaveClickEvent!: boolean;
  @Prop() private animateGif!: boolean;
  @Prop() private customUrl!: string;
  @Prop() private badges!: number;

  get src() {
    let url = process.env.VUE_APP_NERTIVIA_CDN + this.imageId;
    if (!this.isGif) return url;
    if (!this.animateGif || !this.isFocused) {
      url += "?type=webp";
    }
    return url;
  }
  get highPriorityBadge() {
    if (!this.badges) return null;
    return highPriorityBadge(this.badges);
  }
  get isFocused() {
    return WindowProperties.isFocused;
  }
  get isGif() {
    return this.imageId.endsWith(".gif");
  }
  get bgColor() {
    if (this.imageId) return null;
    if (!this.seedId) return null;
    return seededColor(this.seedId);
  }
  get style() {
    const style: any = {
      width: this.size,
      height: this.size
    };

    if (this.highPriorityBadge) {
      style.borderColor = this.highPriorityBadge.color;
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
  border: solid 3px transparent;
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
