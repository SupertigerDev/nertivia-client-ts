<template>
  <div class="selector">
    <div class="name" v-if="name">{{ name }}</div>
    <div class="items">
      <div
        class="item"
        v-for="(item, index) in items"
        :key="item"
        :class="{ selected: index === modelValue }"
        @click="$emit('update:modelValue', index)"
      >
        {{ item }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "@vue/runtime-core";

export default defineComponent({
  emits: ["update:modelValue"],
  props: {
    modelValue: Number,
    name: String,
    items: {
      type: Array as PropType<string[]>,
      required: true,
    },
  },
});
</script>

<style lang="scss" scoped>
.selector {
  align-self: flex-start;
}
.name {
  margin-bottom: 10px;
  margin-top: 10px;
}

.items {
  display: flex;
  border-radius: 4px;
  background: var(--card-color);
  overflow: hidden;
}
.item {
  padding: 5px;
  border-radius: 4px;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.6);
  &:hover {
    color: white;
    background: rgba(255, 255, 255, 0.1);
  }
  &.selected {
    background: var(--primary-color);
    color: white;
  }
}
</style>
