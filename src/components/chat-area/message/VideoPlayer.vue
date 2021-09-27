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
        :src="embedURL"
        frameborder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      />
    </div>
  </div>
</template>

<script lang="ts">
// TODO: remove resizeKeepAspect
import resizeKeepAspect from "@/utils/resizeKeepAspect";
import { useWindowProperties } from "@/utils/windowProperties";
import { PropType } from "vue";
import { defineComponent } from "vue";
export default defineComponent({
  name: "VideoPlayer",
  components: {},
  props: {
    thumbnailURL: {
      type: String,
      required: true,
    },
    file: {
      type: Object as PropType<{
        fileID: string;
        fileName: string;
        url: string;
      }>,
      required: false,
    },
    youtubeURL: {
      type: String,
      required: false,
    },
  },
  data() {
    return {
      loadPlayer: false,
    };
  },
  computed: {
    fileURL(): any {
      if (!this.file) return undefined;
      // nertivia cdn
      if (this.file.url) return this.file.url;
      // google drive cdn
      return (
        process.env.VUE_APP_FETCH_PREFIX +
        `/files/${this.file.fileID}/${this.file.fileName}`
      );
    },
    embedURL(): any {
      if (!this.youtubeURL) return undefined;
      const regex =
        /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*)(?:(\?t|&start)=(\d+))?.*/gim;
      const result = regex.exec(this.youtubeURL);
      if (!result) return undefined;
      const id = result[2];
      const time = parseInt(result[4]);
      let url = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&vq=hd360`;
      if (!isNaN(time)) {
        url += "&start=" + time;
      }
      return url;
    },
    windowSize(): any {
      const { resizeWidth, resizeHeight } = useWindowProperties();
      return {
        height: resizeHeight,
        width: resizeWidth,
      };
    },
  },
  watch: {
    windowSize: {
      handler: "setDimensions",
    },
  },
  mounted() {
    this.setDimensions();
  },
  methods: {
    setDimensions() {
      const contentEl = this.$refs["content"] as any;
      const logsEl = document.getElementById("messageLogs");

      if (!contentEl) return;
      if (!logsEl) return;
      resizeKeepAspect(contentEl, logsEl, 1920, 1080);
    },
  },
});
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
