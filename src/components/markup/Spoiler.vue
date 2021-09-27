<template>
  <span class="spoiler" v-bind:class="{ spoiled: isSpoiled }" @click="spoil">
    <slot></slot>
  </span>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  props: {
    spoiled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return { isSpoiled: this.spoiled };
  },
  methods: {
    spoil() {
      this.isSpoiled = true;
    },
  },
});
</script>

<style scoped>
.spoiler {
  position: relative;
  display: inline-flex;
  overflow: hidden;
  border-radius: 3px;
}

.spoiler::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--spoiler-color);
  cursor: pointer;
  z-index: 1;
}

.spoiler.spoiled {
  background-color: transparent;
}

.spoiler.spoiled::after {
  visibility: hidden;
}
</style>
