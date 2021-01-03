<template>
  <button
    class="button"
    type="submit"
    :class="{ warn, valid }"
    @click="$emit('click')"
  >
    {{ name }}
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
}
</script>

<style lang="scss" scoped>
.button {
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
  &.disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}
</style>
