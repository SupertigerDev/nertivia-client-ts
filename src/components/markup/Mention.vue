<template>
  <span class="mention">{{ text }}</span>
</template>
<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  props: {
    text: {
      type: String,
    },
  },
});
</script>

<style>
.mention {
  display: inline-block;
  color: var(--link-color);
  font-weight: bold;
  cursor: pointer;
}
.mention:hover {
  text-decoration: underline;
}
</style>
