<template>
  <div class="file-upload" ref="container">
    <div class="animate-container">
      <ImageInput v-if="isImage" />
      <FileInput v-else />
    </div>
  </div>
</template>

<script lang="ts">
import { FileUploadModule } from "@/store/modules/fileUpload";
import { MeModule } from "@/store/modules/me";
import { PopoutsModule } from "@/store/modules/popouts";
import fileSize from "filesize";
import FileInput from "./FileInput.vue";
import ImageInput from "./ImageInput.vue";

import { defineComponent } from "vue";
export default defineComponent({
  name: "MainApp",
  components: { FileInput, ImageInput },
  computed: {
    isImage(): any {
      const mimeType = this.file?.type;
      return mimeType?.split("/")[0] === "image";
    },
    file(): any {
      return FileUploadModule.file.file;
    },
  },
  mounted() {
    if (!this.isImage) {
      if (!MeModule.user.googleDriveLinked) {
        PopoutsModule.ShowPopout({
          id: "link-google-drive",
          component: "LinkGoogleDrive",
        });
        FileUploadModule.SetFile(undefined);
        return;
      }
    }
    // file size check
    const maxSize = 52424000; //50MB
    if ((this.file?.size || 0) > maxSize) {
      alert(`File size exeeded 50MB! (${fileSize(this.file?.size || 0)})`);
      FileUploadModule.SetFile(undefined);
    }
    document.addEventListener("keydown", this.keyDown);
    FileUploadModule.SetIsImage(this.isImage || false);
  },
  beforeUnmount() {
    document.removeEventListener("keydown", this.keyDown);
  },
  methods: {
    keyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        FileUploadModule.SetFile(undefined);
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.file-upload {
  display: flex;
  min-height: 80px;
  background: #2b2c2f;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.6);
  position: absolute;
  left: 10px;
  position: absolute;
  bottom: 5px;
  left: 10px;
  margin-right: 10px;
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
