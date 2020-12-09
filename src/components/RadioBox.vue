<template>
  <div class="radio-box-list">
    <div
      class="radio-box"
      v-for="(item, i) in items"
      :key="i"
      :class="{ checked: selectedIndex === i }"
      @click="clicked(i)"
    >
      <div class="circle" />
      <div class="name">{{ item }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Model, Prop, Vue } from "vue-property-decorator";
@Component
export default class RadioBox extends Vue {
  @Model("change", { type: Number }) readonly selectedIndex!: number;
  @Prop() private items!: string[];
  clicked(index: number) {
    this.$emit("change", index);
  }
}
</script>
<style lang="scss" scoped>
.radio-box {
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  &.checked {
    .circle {
      background: var(--primary-color);
    }
  }
}
.circle {
  border-radius: 50%;
  flex-shrink: 0;
  height: 15px;
  width: 15px;
  background: gray;
  margin: 5px;
  margin-left: 0;
}
</style>
