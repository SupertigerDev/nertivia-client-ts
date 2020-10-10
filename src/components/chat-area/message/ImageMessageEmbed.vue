<template>
  <div class="image-embed">
    <img loading="lazy" :src="imageURL" />
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

  mounted() {
    this.setDimensions();
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

<style scoped>
.image-embed {
  margin-top: 5px;
}
img {
  width: 100%;
  height: 100%;
  border-radius: 4px;
}
</style>
