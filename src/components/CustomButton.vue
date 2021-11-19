<template>
  <button
    class="button"
    type="submit"
    :class="{
      alert: alert,
      warn: warn,
      valid: valid,
      disabled,
    }"
    @click="$emit('click')"
  >
    <span
      v-if="icon && iconPos !== 'right'"
      class="material-icons icon left"
      :class="{ 'no-text': !name }"
      :style="{ fontSize: iconSize }"
      >{{ icon }}</span
    >
    <div class="name">{{ name }}</div>
    <span
      v-if="icon && iconPos === 'right'"
      class="material-icons icon right"
      :style="{ fontSize: iconSize }"
      >{{ icon }}</span
    >
  </button>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  emits: ["click"],
  name: "CustomInput",
  props: {
    name: {
      type: String,
      required: false,
    },
    alert: {
      type: Boolean,
      required: false,
    },
    warn: {
      type: Boolean,
      required: false,
    },
    disabled: {
      type: Boolean,
      required: false,
    },
    valid: {
      type: Boolean,
      required: false,
    },
    icon: {
      type: String,
      required: false,
    },
    iconPos: {
      type: String,
      required: false,
    },
    iconSize: {
      type: String,
      required: false,
    },
  },
  data() {
    return {
      focused: false,
    };
  },
});
</script>

<style lang="scss" scoped>
.button {
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  margin: 4px;
  border-radius: 6px;
  padding: 8px;
  font-size: 14px;
  border: none;
  cursor: pointer;
  user-select: none;
  background: none;
  outline: none;
  transition: 0.2s;
  color: rgba(255, 255, 255, 0.7);
  background: rgba(255, 255, 255, 0.05);

  &:hover {
    background: var(--primary-color);
    color: white;
    .icon {
      color: white;
    }
  }
  &.alert:hover {
    background: var(--alert-color);
  }
  &.warn:hover {
    background: var(--warn-color);
  }
  &.valid:hover {
    background: var(--success-color);
  }
}
.icon {
  color: var(--primary-color);
  transition: 0.2s;
  &.left {
    margin-right: 5px;
  }
  &.right {
    margin-left: 5px;
  }
  &.no-text {
    margin-left: 0;
    margin-right: 0;
  }
}
.alert .icon {
  color: var(--alert-color);
}
.warn .icon {
  color: var(--warn-color);
}
.valid .icon {
  color: var(--success-color);
}
.disabled {
  opacity: 0.5;
  pointer-events: none;
}
</style>
