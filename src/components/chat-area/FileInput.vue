<template>
  <div class="file">
    <div class="icon material-icons">insert_drive_file</div>
    <div class="details">
      <div class="name">{{ name }}</div>
      <div class="size">{{ sizeLabel }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { FileUploadModule } from "@/store/modules/fileUpload";
import fileSize from "filesize";

import { defineComponent } from "vue";
export default defineComponent({
  name: "MainApp",
  computed: {
    name(): any {
      return this.file?.name;
    },
    sizeLabel(): any {
      return fileSize(this.size);
    },
    size(): any {
      return this.file?.size || 0;
    },
    file(): any {
      return FileUploadModule.file.file;
    },
  },
});
</script>

<style lang="scss" scoped>
.icon {
  font-size: 40px;
  margin-left: 10px;
  margin-right: 10px;
}
.details {
  overflow: hidden;
}
.file {
  display: flex;
  align-items: center;
  height: 100%;
  margin-right: 10px;
}
.name {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;
}
.size {
  opacity: 0.5;
}
</style>
