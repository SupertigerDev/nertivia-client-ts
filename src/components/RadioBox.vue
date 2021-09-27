<template>
  <div class="radio-box-list">
    <div
      class="radio-box"
      v-for="(item, i) in items"
      :key="i"
      :class="{ checked: modelValue === i }"
      @click="clicked(i)"
    >
      <div class="circle" />
      <div class="name">{{ item }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType } from "vue";

import { defineComponent } from "vue";
export default defineComponent({
  emits: ["change", "update:modelValue"],
  props: {
    items: Array as PropType<string[]>,
    modelValue: Number,
  },
  methods: {
    clicked(index: number) {
      this.$emit("update:modelValue", index);
      this.$emit("change", index);
    },
  },
});
</script>
<style lang="scss" scoped>
.radio-box-list {
  display: flex;
  flex-direction: column;
}
.name {
  z-index: 11111;
}
.circle {
  z-index: 11111;
}
.radio-box {
  display: flex;
  position: relative;
  align-self: flex-start;
  align-items: center;
  padding-right: 5px;
  cursor: pointer;
  user-select: none;
  margin: 2px;
  padding-left: 5px;
  border-radius: 4px;
  overflow: hidden;
  &:before {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    opacity: 0.2;
    transition: 0.1s;
  }
  &:hover {
    &:before {
      background: rgba(255, 255, 255, 0.05);
    }
    .circle {
      background: rgba(255, 255, 255, 0.1);
    }
  }

  &.checked {
    &:before {
      background: var(--primary-color);
    }
    .circle {
      background: var(--primary-color);
    }
  }
}
.circle {
  border-radius: 50%;
  flex-shrink: 0;
  height: 13px;
  width: 13px;
  border: solid 2px rgba(255, 255, 255, 0.5);
  margin: 5px;
  margin-left: 0;
}
</style>
