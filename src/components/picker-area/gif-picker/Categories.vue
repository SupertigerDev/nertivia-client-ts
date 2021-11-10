<template>
  <div class="categories">
    <div
      class="item"
      v-for="({ name, previewUrl }, i) in items"
      :key="i"
      @click="$emit('search', name)"
    >
      <div class="name">{{ name }}</div>
      <img class="image" :src="previewUrl" alt="" loading="lazy" />
    </div>
  </div>
</template>

<script lang="ts">
import { TenorCategory } from "@/services/tenorService";
import { defineComponent, PropType } from "@vue/runtime-core";

export default defineComponent({
  props: {
    items: {
      type: Array as PropType<TenorCategory[]>,
    },
  },
});
</script>

<style lang="scss" scoped>
.categories {
  display: flex;
  flex-wrap: wrap;
  overflow: auto;
  gap: 5px;
  margin-top: 5px;
  margin-left: 5px;
}
.item {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  overflow: hidden;
  height: 100px;
  width: 178px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  .image {
    z-index: 1;
    height: 100%;
    width: 100%;
    object-fit: cover;
    position: relative;
  }
  &:before {
    content: "";
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    z-index: 1111;
  }
  .name {
    position: absolute;
    z-index: 11111;
    font-size: 18px;
  }
}
</style>
