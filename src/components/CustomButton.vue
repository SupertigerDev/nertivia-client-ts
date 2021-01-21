<template>
  <button
    class="button"
    type="submit"
    :class="{ filled, warn, valid }"
    @click="$emit('click')"
  >
    <span v-if="icon && iconPos !== 'right'" class="material-icons">{{
      icon
    }}</span>
    {{ name }}
    <span v-if="icon && iconPos === 'right'" class="material-icons">{{
      icon
    }}</span>
  </button>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class CustomInput extends Vue {
  focused = false;
  @Prop() private name!: string;
  @Prop() private warn!: boolean;
  @Prop() private valid!: boolean;
  @Prop() private filled!: boolean;
  @Prop() private icon!: string;
  @Prop() private iconPos!: string;
}
</script>

<style lang="scss" scoped>
.button {
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  color: var(--primary-color);
  border: solid 1px var(--primary-color);
  margin: 4px;
  border-radius: 6px;
  padding: 8px;
  font-size: 14px;
  cursor: pointer;
  user-select: none;
  background: none;
  outline: none;
  transition: 0.2s;
  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
  &:focus {
    background: var(--primary-color);
    color: white;
  }
  &.warn {
    color: var(--alert-color);
    border: solid 1px var(--alert-color);
    &:focus {
      background: var(--alert-color);
      color: white;
    }
  }
  &.valid {
    color: var(--success-color);
    border: solid 1px var(--success-color);
    &:focus {
      background: var(--success-color);
      color: white;
    }
  }

  &.filled {
    background: var(--primary-color);
    color: white;
    &:hover {
      color: var(--primary-color);
      background: rgba(255, 255, 255, 0.05);
    }
    &.warn {
      background: var(--alert-color);
      color: white;
      border: solid 1px var(--alert-color);
      &:hover {
        background: rgba(255, 255, 255, 0.05);
        color: var(--alert-color);
      }
    }

    &.valid {
      color: white;
      background: var(--success-color);
      border: solid 1px var(--success-color);
      &:hover {
        background: rgba(255, 255, 255, 0.05);
        color: var(--success-color);
      }
    }
  }

  &.disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}
</style>
