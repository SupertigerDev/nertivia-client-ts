<template>
  <div class="input">
    <fieldset
      class="content"
      :class="{
        focused: focused || modelValue?.length,
        error,
        valid: validMessage,
        disabled,
        connectLeft,
        connectRight,
      }"
      @click="onClick"
    >
      <legend class="title">
        {{ title + (maxChars ? ` (${charCount}/${maxChars})` : "") }}
      </legend>
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
          v-if="!textArea"
          :placeholder="placeholder"
          @input="inputEvent"
          :value="modelValue"
        />
        <textarea
          v-if="textArea"
          class="main-input textarea"
          :class="{ hasPrefix: !!prefix }"
          @focus="focused = true"
          @blur="focused = false"
          :disabled="disabled"
          :type="type || 'text'"
          ref="inputBox"
          :placeholder="placeholder"
          @input="inputEvent"
          :value="modelValue"
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
import { defineComponent } from "vue";
export default defineComponent({
  name: "CustomInput",
  data() {
    return {
      focused: false,
    };
  },
  props: {
    title: String,
    maxChars: Number,
    placeholder: String,
    type: String,
    error: String,
    disabled: { default: false },
    textArea: { default: false },
    validMessage: String,
    modelValue: String,
    prefix: String,
    prefixIcon: String,
    connectLeft: Boolean,
    connectRight: Boolean,
    hideError: { default: false },
  },
  emits: ["update:modelValue"],
  methods: {
    inputEvent(event: any) {
      this.$emit("update:modelValue", event.target.value);
    },
    onClick(event: MouseEvent) {
      (event?.target as HTMLButtonElement).click();
    },
  },
  computed: {
    charCount(): number {
      return (this.modelValue as string).length;
    },
  },
});
</script>

<style lang="scss" scoped>
.input {
  flex-shrink: 0;
}
.content {
  border-radius: 8px;
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
  .connectLeft {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    margin-left: -1px;
  }
  .connectRight {
    margin-right: -1px;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
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
  &.textarea {
    resize: none;
    height: 200px;
    width: 200px;
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
