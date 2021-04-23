<template>
  <span class="spoiler" v-bind:class="{ spoiled: isSpoiled }" @click="spoil">
    <slot></slot>
  </span>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
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
      this.isSpoiled = true
    },
  },
});
</script>

<style>
:root {
  --spoiler-color: 30, 30, 40;
}
</style>

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
  background-color: rgb(var(--spoiler-color));
  cursor: pointer;
  z-index: 1;
}

.spoiler.spoiled {
  background-color: rgb(var(--spoiler-color), 0.2);
}

.spoiler.spoiled::after {
  visibility: hidden;
}
</style>
