<template>
  <div class="check-box" :class="{ checked }" @click="clicked">
    <div class="box" />
    <div class="name">{{ name }}</div>
  </div>
</template>

<script lang="ts">
import { Component, Model, Prop, Vue } from "vue-property-decorator";

@Component
export default class Checkbox extends Vue {
  @Model("change", { type: Boolean }) readonly checked!: boolean;
  @Prop() private name!: string;
  clicked() {
    this.$emit("change", !this.checked);
  }
}
</script>
<style lang="scss" scoped>
.check-box {
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  &.checked {
    .box {
      background: var(--primary-color);
    }
  }
}
.box {
  flex-shrink: 0;
  height: 15px;
  width: 15px;
  background: gray;
  margin: 5px;
}
</style>
