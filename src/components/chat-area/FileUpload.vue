<template>
  <div class="file-upload" ref="container" :style="{ top: height }">
    <div class="animate-container">
      <ImageInput v-if="isImage" />
      <FileInput v-else />
    </div>
  </div>
</template>

<script lang="ts">
import { FileUploadModule } from "@/store/modules/fileUpload";
import { Component, Vue } from "vue-property-decorator";
import FileInput from "./FileInput.vue";
import ImageInput from "./ImageInput.vue";

@Component({ components: { FileInput, ImageInput } })
export default class MainApp extends Vue {
  height = "-90px";
  mounted() {
    document.addEventListener("keydown", this.keyDown);
    this.height =
      -((this.$refs.container as HTMLElement).clientHeight + 10) + "px";
    FileUploadModule.SetIsImage(this.isImage || false);
  }
  beforeDestroy() {
    document.removeEventListener("keydown", this.keyDown);
  }
  get isImage() {
    const mimeType = this.file?.type;
    return mimeType?.split("/")[0] === "image";
  }
  keyDown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      FileUploadModule.SetFile(undefined);
    }
  }
  get file() {
    return FileUploadModule.file.file;
  }
}
</script>

<style lang="scss" scoped>
.file-upload {
  display: flex;
  min-height: 80px;
  padding-right: 10px;
  background: #393e46ef;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.6);
  position: absolute;
  top: -90px;
  left: 10px;
  border-radius: 4px;
  z-index: 999999999;
  overflow: hidden;
}
.animate-container {
  opacity: 0;
  animation: showUp 0.2s;
  overflow: hidden;
  animation-fill-mode: forwards;
}
@keyframes showUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
