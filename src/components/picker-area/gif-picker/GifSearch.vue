<template>
  <div class="searches">
    <div
      class="item"
      v-for="({ preview, url, siteUrl }, i) in items"
      :key="i"
      @click="onClick(siteUrl)"
    >
      <video
        class="video"
        :src="url"
        autoplay
        loop
        v-if="isWindowFocus"
      ></video>
      <img class="image" v-else :src="preview" alt="" loading="lazy" />
    </div>
  </div>
</template>

<script lang="ts">
import { TenorSearch } from "@/services/tenorService";
import { defineComponent, PropType } from "@vue/runtime-core";
import { useWindowProperties } from "@/utils/windowProperties";
import { insert } from "text-field-edit";

export default defineComponent({
  props: {
    items: Array as PropType<TenorSearch[]>,
    inputElement: {
      type: Object as PropType<HTMLTextAreaElement>,
      required: true,
    },
  },
  methods: {
    onClick(url: string) {
      insert(this.inputElement, url + " ");
      this.inputElement.focus();
      this.$emit("close");
    },
  },
  computed: {
    isWindowFocus() {
      return useWindowProperties().isFocused;
    },
  },
});
</script>

<style lang="scss" scoped>
.searches {
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
  .video {
    height: 100%;
    width: 100%;
    object-fit: cover;
  }
}
</style>
