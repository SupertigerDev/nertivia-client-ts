<template>
  <div class="image-embed">
    <div class="gif" v-if="isGif">GIF</div>
    <img v-if="loadImage" :src="pauseGifURL" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import windowProperties from "@/utils/windowProperties";
import Message from "@/interfaces/Message";
import config from "@/config";
@Component
export default class ImageMessageEmbed extends Vue {
  @Prop() private message!: Message & { grouped: boolean };
  loadImage = false;
  intersectObserver: IntersectionObserver | null = null;

  mounted() {
    this.setDimensions();

    this.intersectObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadImage = true;
          this.intersectObserver?.unobserve(this.$el);
          this.intersectObserver?.disconnect();
        }
      });
    });
    this.intersectObserver.observe(this.$el);
  }
  beforeDestroy() {
    this.intersectObserver?.unobserve(this.$el);
    this.intersectObserver?.disconnect();
  }

  clamp(num: number, min: number, max: number) {
    return num <= min ? min : num >= max ? max : num;
  }
  calculateAspectRatioFit(
    srcWidth: number,
    srcHeight: number,
    maxWidth: number,
    maxHeight: number
  ) {
    const ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
    return { width: srcWidth * ratio, height: srcHeight * ratio };
  }

  @Watch("windowSize")
  setDimensions() {
    const logsEl = document.getElementById("messageLogs");
    if (!logsEl) return {};
    const w = logsEl.offsetWidth;
    const h = logsEl.offsetHeight;
    const minWidth = w / 1.5;
    const minHeight = h / 1.5;

    const dimensions = this.message.files?.[0]?.dimensions;
    if (!dimensions) return {};
    const srcWidth = dimensions.width;
    const srcHeight = dimensions.height;
    const newDimentions = this.calculateAspectRatioFit(
      srcWidth,
      srcHeight,
      this.clamp(minWidth, 0, 500),
      minHeight
    );

    (this.$el as HTMLElement).style.height =
      this.clamp(newDimentions.height, 0, srcHeight) + "px";
    (this.$el as HTMLElement).style.width =
      this.clamp(newDimentions.width, 0, srcWidth) + "px";
  }

  // pause gif when window is not focused
  get pauseGifURL() {
    const isWindowFocused = windowProperties.isFocused;
    let url = this.imageURL;
    if (!isWindowFocused && this.isGif) {
      url += `?type=webp`;
    }
    return url;
  }
  get isGif() {
    return this.imageURL?.endsWith(".gif");
  }
  get imageURL() {
    const file = this.message.files?.[0];
    if (!file) return undefined;
    // nertivia cdn
    if (file.url) return file.url;
    // google drive cdn
    return config.fetchPrefix + `/media/${file.fileID}/${file.fileName}`;
  }
  get windowSize() {
    return {
      height: windowProperties.resizeHeight,
      width: windowProperties.resizeWidth
    };
  }
}
</script>

<style scoped lang="scss">
.image-embed {
  margin-top: 5px;
  position: relative;
}
img {
  width: 100%;
  height: 100%;
  border-radius: 4px;
}
.image-embed:hover {
  .gif {
    opacity: 0;
  }
}
.gif {
  position: absolute;
  top: 5px;
  left: 5px;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  padding: 3px;
  border-radius: 4px;
  transition: 0.2s;
}
</style>
