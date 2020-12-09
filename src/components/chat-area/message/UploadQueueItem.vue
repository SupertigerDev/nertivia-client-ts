<template>
  <div class="item">
    <div class="details">
      <div class="same-line">
        <div class="name">{{ item.file.name }}</div>
        <div class="size">{{ sizeLabel }}</div>
      </div>
      <div class="progress" v-if="item.uploading && item.progress !== 100">
        {{ item.progress }}% complete...
      </div>
      <div class="progress" v-else>Processing...</div>
      <div class="state" v-if="!item.uploading">
        Pending...
      </div>
    </div>
    <div class="seperator">
      <div class="bar" :style="{ width: item.progress + '%' }" />
    </div>
  </div>
</template>

<script lang="ts">
import fileSize from "filesize";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class UploadQueueItem extends Vue {
  @Prop() private item!: { file: File; uploading: boolean; progress: number };
  get sizeLabel() {
    return fileSize(this.item.file.size);
  }
}
</script>

<style lang="scss" scoped>
.item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 5px;
  .size {
    opacity: 0.6;
    margin: auto;
    margin-right: 0;
  }
  .state {
    opacity: 0.6;
  }
  .material-icons {
    font-size: 30px;
    width: 40px;
    display: flex;
    align-self: center;
    justify-content: center;
    margin-right: 5px;
  }
  .details {
    display: flex;
    width: 100%;
    flex-direction: column;
  }
  .same-line {
    display: flex;
    width: 100%;
    align-items: center;
    align-content: center;
  }
  .progress {
    opacity: 0.6;
  }
}
.seperator {
  width: 100%;
  height: 2px;
  background: rgba(255, 255, 255, 0.3);
  margin-top: 5px;
  .bar {
    height: 100%;
    width: 0;
    background: var(--primary-color);
  }
}
</style>
