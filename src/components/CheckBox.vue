<template>
  <div class="check-box" :class="{ checked, colored }" @click="clicked">
    <div class="name">{{ name }}</div>
    <div class="description" v-if="description">{{ description }}</div>
  </div>
</template>

<script lang="ts">
import { Component, Model, Prop, Vue } from "vue-property-decorator";

@Component
export default class CheckBox extends Vue {
  @Model("change", { type: Boolean }) readonly checked!: boolean;
  @Prop() private name!: string;
  @Prop() private description?: string;
  @Prop() private colored!: string;

  clicked() {
    this.$emit("change", !this.checked);
  }
}
</script>
<style lang="scss" scoped>
.check-box {
  display: flex;
  flex-direction: column;
  cursor: pointer;
  user-select: none;
  margin: 2px;
  border-radius: 4px;
  overflow: hidden;
  flex-shrink: 0;
  padding: 5px;
  padding-left: 10px;
  position: relative;
  transition: 0.2s;
  background: rgba(255, 255, 255, 0.05);

  &:before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: 3px;
    bottom: 0;
    background: rgba(255, 255, 255, 0.3);
  }
  &:hover {
    background: rgba(255, 255, 255, 0.1);

    &:before {
      background: rgba(255, 255, 255, 0.6);
    }
  }
  &.colored {
    &:before {
      background: var(--alert-color);
    }
  }
  &.checked {
    background: rgba(255, 255, 255, 0.1);

    &:before {
      background: var(--primary-color);
    }
  }
}
.description {
  color: rgba(255, 255, 255, 0.5);
  font-size: 14px;
}
</style>
