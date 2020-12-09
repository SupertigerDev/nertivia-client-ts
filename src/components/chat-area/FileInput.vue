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
import { Component, Vue } from "vue-property-decorator";
import fileSize from "filesize";

@Component
export default class MainApp extends Vue {
  get name() {
    return this.file?.name;
  }
  get sizeLabel() {
    return fileSize(this.size);
  }
  get size() {
    return this.file?.size || 0;
  }
  get file() {
    return FileUploadModule.file.file;
  }
}
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
