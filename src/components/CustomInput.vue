<template>
  <div class="input">
    <div class="content">
      <div class="title">{{ title }}</div>
      <input class="main-input" :type="type || 'text'" />
    </div>
    <div class="error-message">{{ error }}</div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class CustomInput extends Vue {
  @Prop() private title!: string;
  @Prop() private placeholder!: string;
  @Prop() private type!: string;
  @Prop() private error!: string;
}
</script>

<style lang="scss" scoped>
.input {
  flex-shrink: 0;
}
.content {
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  overflow: hidden;
}
.title {
  padding: 5px;
  opacity: 0.8;
}
.main-input {
  border: none;
  font-size: 14px;
  padding: 10px;
  color: white;
  outline: none;
  background: rgba(255, 255, 255, 0.2);
}

.error-message {
  color: var(--alert-color);
  margin-top: 2px;
  min-height: 21px;
}
</style>
