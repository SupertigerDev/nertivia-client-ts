<template>
  <div class="upload-queue">
    <div class="title">
      <div class="material-icons">upload</div>
      <div class="name">Upload Queue</div>
    </div>
    <UploadQueueItem
      v-for="(item, key) in queueItems"
      :key="key"
      :item="item"
    />
  </div>
</template>

<script lang="ts">
import UploadQueueItem from "./UploadQueueItem.vue";
import { FileUploadModule } from "@/store/modules/fileUpload";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({ components: { UploadQueueItem } })
export default class UploadQueue extends Vue {
  get queueItems() {
    return FileUploadModule.uploadQueue;
  }
}
</script>

<style lang="scss" scoped>
.upload-queue {
  display: flex;
  background: rgba(255, 255, 255, 0.1);
  flex-direction: column;
  margin: 10px;
  padding: 5px;
  margin-bottom: 0;
}
.title {
  display: flex;
  align-items: center;
  .name {
    margin-left: 5px;
  }
}
</style>
