<template>
  <div class="source" :class="{ selected }">
    <img class="thumbnail" :src="source.thumbnail" alt="" />
    <div class="name">{{ source.name }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { CaptureSource } from "@/interfaces/ElectronBridge";

export default defineComponent({
  props: {
    selected: Boolean,
    source: {
      type: Object as PropType<CaptureSource>,
      required: true,
    },
  },
});
</script>

<style lang="scss" scoped>
.source {
  display: flex;
  flex-direction: column;
  border-radius: 4px;
  overflow: hidden;
  width: 200px;
  height: 140px;
  background: var(--card-color);
  cursor: pointer;
  padding: 5px;
  &.selected {
    background-color: var(--primary-color);
  }
  .name {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    padding-top: 5px;
    padding-bottom: 5px;
    text-align: center;
    margin-right: 5px;
  }
  .thumbnail {
    height: 100%;
    width: 100%;
    object-fit: contain;
    overflow: hidden;
  }
}
</style>
