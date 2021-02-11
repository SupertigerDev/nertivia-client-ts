<template>
  <div
    class="image-embed"
    :class="{ animate: isWindowFocused && !loadImage }"
    @click="onClick"
  >
    <div class="outer-content">
      <div class="inner-content" ref="content">
        <div class="gif" v-if="isGif">GIF</div>
        <img v-if="loadImage" :src="pauseGifURL" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import windowProperties from "@/utils/windowProperties";
import Message from "@/interfaces/Message";
import config from "@/config";
import resizeKeepAspect from "@/utils/resizeKeepAspect";
import { PopoutsModule } from "@/store/modules/popouts";
@Component
export default class ImageMessageEmbed extends Vue {
  @Prop() private message!: Message & { grouped: boolean };
  loadImage = false;
  intersectObserver: IntersectionObserver | null = null;

  mounted() {
    const contentEl = this.$refs["content"] as any;

    this.setDimensions();

    this.intersectObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.fetchImage();
          this.intersectObserver?.unobserve(contentEl);
          this.intersectObserver?.disconnect();
        }
      });
    });
    this.intersectObserver.observe(contentEl);
  }
  beforeDestroy() {
    const contentEl = this.$refs["content"] as any;

    this.intersectObserver?.unobserve(contentEl);
    this.intersectObserver?.disconnect();
  }
  onClick() {
    PopoutsModule.ShowPopout({
      id: "image-preview-popout",
      component: "image-preview-popout",
      data: {
        url: this.imageURL,
        dimensions: this.dimensions
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

  @Watch("windowSize")
  setDimensions() {
    const contentEl = this.$refs["content"] as any;
    const logsEl = document.getElementById("messageLogs");
    if (!this.dimensions) return;
    if (!contentEl) return;
    if (!logsEl) return;
    resizeKeepAspect(
      contentEl,
      logsEl,
      this.dimensions.width,
      this.dimensions.height
    );
  }

  get dimensions() {
    return this.message.files?.[0]?.dimensions;
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
  min-width: 200px;
  min-height: 200px;

  cursor: pointer;
  &:hover {
    &::after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
      border-radius: 4px;
      overflow: hidden;
      background: rgba(0, 0, 0, 0.3);
    }
  }
}
.inner-content {
  display: flex;
}
.outer-content {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
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
