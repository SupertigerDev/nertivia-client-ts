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
import { seededColor } from "seeded-color";
import { useWindowProperties } from "@/utils/windowProperties";
import { highPriorityBadge } from "@/constants/badges";
import Vue from "vue";
import { defineComponent } from "vue";
export default defineComponent({
  name: "MainApp",
  props: {
    size: {
      type: String,
      required: true
    },
    imageId: {
      type: String,
      required: true
    },
    seedId: {
      type: String,
      required: true
    },
    willHaveClickEvent: {
      type: Boolean,
      required: true
    },
    animateGif: {
      type: Boolean,
      required: true
    },
    customUrl: {
      type: String,
      required: true
    },
    badges: {
      type: Number,
      required: true
    }
  },
  computed: {
    src(): any {
      let url = process.env.VUE_APP_NERTIVIA_CDN + this.imageId;
      if (!this.isGif) return url;
      if (!this.animateGif || !this.isFocused) {
        url += "?type=webp";
      }
      return url;
    },
    highPriorityBadge(): any {
      if (!this.badges) return null;
      return highPriorityBadge(this.badges);
    },
    isFocused(): any {
      return useWindowProperties().isFocused;
    },
    isGif(): any {
      return this.imageId.endsWith(".gif");
    },
    bgColor(): any {
      if (this.imageId) return null;
      if (!this.seedId) return null;
      return seededColor(this.seedId);
    },
    style(): any {
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
});
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
