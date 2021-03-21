<template>
  <div class="player" ref="content">
    <div
      class="thumbnail"
      :style="{ backgroundImage: `url(${thumbnailURL})` }"
      v-if="!loadPlayer"
      @click="loadPlayer = true"
    >
      <div class="material-icons play-button">play_arrow</div>
    </div>
    <div class="content" v-if="loadPlayer">
      <video class="video" v-if="file" :src="fileURL" controls autoplay></video>
      <iframe
        v-if="youtubeURL"
        class="video"
        ref="video"
        width="100%"
        height="100%"
        :src="
          `https://www.youtube-nocookie.com/embed/${youtubeID}?autoplay=1&vq=hd360`
        "
        frameborder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      />
    </div>
  </div>
</template>

<script lang="ts">
import resizeKeepAspect from "@/utils/resizeKeepAspect";
import windowProperties from "@/utils/windowProperties";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
@Component({ components: {} })
export default class VideoPlayer extends Vue {
  @Prop() private thumbnailURL!: string;
  @Prop() private file!: { fileID: string; fileName: string; url: string };
  @Prop() private youtubeURL!: string;
  loadPlayer = false;

  mounted() {
    this.setDimensions();
  }

  @Watch("windowSize")
  setDimensions() {
    const contentEl = this.$refs["content"] as any;
    const logsEl = document.getElementById("messageLogs");

    if (!contentEl) return;
    if (!logsEl) return;
    resizeKeepAspect(contentEl, logsEl, 1920, 1080);
  }
  get fileURL() {
    if (!this.file) return undefined;
    // nertivia cdn
    if (this.file.url) return this.file.url;
    // google drive cdn
    return (
      process.env.VUE_APP_FETCH_PREFIX +
      `/files/${this.file.fileID}/${this.file.fileName}`
    );
  }

  get youtubeID() {
    const regex = /(?:https?:)?(?:\/\/)?(?:[0-9A-Z-]+\.)?(?:youtu\.be\/|youtube(?:-nocookie)?\.com\S*?[^\w\s-])([\w-]{11})(?=[^\w-]|$)(?![?=&+%\w.-]*(?:['"][^<>]*>|<\/a>))[?=&+%\w.-]*/gim;
    return regex.exec(this.youtubeURL)?.[1];
  }
  get windowSize() {
    return {
      height: windowProperties.resizeHeight,
      width: windowProperties.resizeWidth
    };
  }
}
</script>

<style lang="scss" scoped>
.thumbnail {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  background-position: center;
  background-size: cover;
  cursor: pointer;
  .play-button {
    font-size: 40px;
    border-radius: 4px;
    padding: 10px;
    transition: 0.2s;
    background-color: var(--primary-color);
    opacity: 0.6;
  }
  &:hover {
    .play-button {
      opacity: 1;
    }
  }
}
.content {
  height: 100%;
  width: 100%;
}
.video {
  height: 100%;
  width: 100%;
  outline: none;
}
</style>
