<template>
  <div
    class="image-embed"
    :class="{ animate: isWindowFocused && !loadImage }"
    @click="onClick"
  >
    <div class="gif" v-if="isGif">GIF</div>
    <img v-if="loadImage" :src="pauseGifURL" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import windowProperties from "@/utils/windowProperties";
import Message from "@/interfaces/Message";
import config from "@/config";
import { PopoutsModule } from "@/store/modules/popouts";
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
          this.fetchImage();
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
  onClick() {
    PopoutsModule.ShowPopout({
      id: "image-preview-popout",
      component: "image-preview-popout",
      data: {
        url: this.imageURL
      }
    });
  }
  fetchImage() {
    const image = new Image();
    image.onload = () => {
      image.onload = null;
      this.loadImage = true;
    };
    image.src = this.pauseGifURL || "";
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

  get isWindowFocused() {
    return windowProperties.isFocused;
  }
  // pause gif when window is not focused
  get pauseGifURL() {
    let url = this.imageURL;
    if (!this.isWindowFocused && this.isGif) {
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
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.4);
  cursor: pointer;
  &:hover {
    &::after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border-radius: 4px;
      overflow: hidden;
      background: rgba(0, 0, 0, 0.3);
    }
  }
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
.animate {
  animation: animate 1s;
  animation-iteration-count: infinite;
  animation-direction: alternate;
}
@keyframes animate {
  from {
    background: rgba(0, 0, 0, 0.4);
  }
  to {
    background: rgba(0, 0, 0, 0.5);
  }
}
</style>
