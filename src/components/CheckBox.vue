<template>
  <div class="check-box" :class="{ checked, colored }" @click="clicked">
    <div class="box"><span class="material-icons">check</span></div>
    <div class="details">
      <div class="name">{{ name }}</div>
      <div class="description" v-if="description">{{ description }}</div>
    </div>
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
  align-items: center;
  align-content: center;
  cursor: pointer;
  user-select: none;
  margin: 2px;
  border-radius: 4px;
  overflow: hidden;
  flex-shrink: 0;
  padding: 5px;
  padding-left: 5px;
  position: relative;
  transition: 0.2s;
  &:hover {
    .box {
      span {
        opacity: 0.6;
      }
    }
  }

  .box {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 15px;
    width: 15px;
    margin-right: 5px;
    border-radius: 6px;
    flex-shrink: 0;
    border: solid 2px rgba(255, 255, 255, 0.5);
    span {
      opacity: 0;
      transition: 0.2s;
      font-size: 12px;
    }
  }

  &:before {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    opacity: 0.1;
    transition: 0.2s;
    background: rgba(255, 255, 255, 0.5);
  }

  &.checked {
    &:before {
      background: var(--primary-color);
    }
    .box {
      background: var(--primary-color);
      span {
        opacity: 1;
      }
    }
    .description {
      color: var(--primary-color);
    }
  }
}
.description {
  color: rgba(255, 255, 255, 0.5);
  font-size: 14px;
  transition: 0.2s;
}
</style>
