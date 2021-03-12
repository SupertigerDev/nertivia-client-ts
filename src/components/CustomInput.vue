<template>
  <div class="input">
    <fieldset
      class="content"
      :class="{
        focused: focused || value.length,
        error,
        valid: validMessage,
        disabled
      }"
      @click="$refs.inputBox.focus()"
    >
      <legend class="title">{{ title }}</legend>
      <div class="container">
        <div v-if="prefix" class="prefix">{{ prefix }}</div>
        <div v-if="prefixIcon" class="material-icons prefix icon">
          {{ prefixIcon }}
        </div>
        <input
          class="main-input"
          :class="{ hasPrefix: !!prefix }"
          @focus="focused = true"
          @blur="focused = false"
          :disabled="disabled"
          :type="type || 'text'"
          ref="inputBox"
          :placeholder="placeholder"
          @input="inputEvent"
          :value="value"
        />
      </div>
    </fieldset>

    <div class="error-message" v-if="!validMessage && !hideError">
      {{ error }}
    </div>
    <div class="valid-message" v-if="!error && validMessage && !hideError">
      {{ validMessage }}
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({ model: { prop: "value", event: "model" } })
export default class CustomInput extends Vue {
  focused = false;
  @Prop() private title!: string;
  @Prop() private placeholder!: string;
  @Prop() private type!: string;
  @Prop() private error!: string;
  @Prop({ default: false }) private disabled!: boolean;
  @Prop() private validMessage!: string;
  @Prop() private value!: string;
  @Prop() private prefix!: string;
  @Prop() private prefixIcon!: string;
  @Prop({ default: false }) private hideError!: boolean;
  inputEvent(event: any) {
    this.$emit("model", event.target.value);
  }
}
</script>

<style lang="scss" scoped>
.input {
  flex-shrink: 0;
}
.content {
  border-radius: 4px;
  border: solid 2px rgba(255, 255, 255, 0.2);
  overflow: hidden;
  cursor: text;
  transition: 0.2s;
  &.focused {
    border: solid 2px var(--primary-color);
  }
  &.error {
    border: solid 2px var(--alert-color);
  }
  &.valid {
    border: solid 2px var(--success-color);
  }
  &.disabled {
    border: solid 2px gray;
  }
}
.title {
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
}
.main-input {
  border: none;
  font-size: 14px;
  color: white;
  width: 100%;
  outline: none;
  background: none;
  flex: 1;
  &.hasPrefix {
    padding-left: 0;
  }
}

.error-message {
  color: var(--alert-color);
  margin-top: 2px;
  min-height: 21px;
  margin-left: 5px;
  font-size: 12px;
}
.valid-message {
  color: var(--success-color);
  margin-top: 2px;
  min-height: 21px;
  margin-left: 5px;
  font-size: 12px;
}
.container {
  display: flex;
}
.prefix {
  opacity: 0.7;
  user-select: none;
  &.icon {
    opacity: 0.3;
    margin-right: 5px;
  }
}
</style>
