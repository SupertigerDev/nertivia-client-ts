<template>
  <div class="material-icons button" :class="{ warn }" @click="$emit('click')">
    {{ icon }}
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class MessageBoxButtonTemplate extends Vue {
  @Prop() private icon!: string;
  @Prop() private warn!: boolean;
}
</script>

<style lang="scss" scoped>
.button {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 25px;
  cursor: pointer;
  height: 35px;
  opacity: 0.7;
  width: 45px;
  border-radius: 5px;
  transition: 0.2s;
  user-select: none;
  &:hover {
    background: var(--primary-color);
    opacity: 1;
  }
  &.warn {
    &:hover {
      background: var(--alert-color);
      opacity: 1;
    }
  }
}
</style>
