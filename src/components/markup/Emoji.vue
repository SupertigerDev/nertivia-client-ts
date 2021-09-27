<template>
  <img
    class="emoji"
    :draggable="false"
    :title="emoji.annotation"
    :alt="emoji.annotation"
    :src="src"
  />
</template>

<script lang="ts">
import emojiParser from "@/utils/emojiParser";
import { defineComponent } from "vue";

export default defineComponent({
  props: ["emoji"],
  computed: {
    src(): string {
      return emojiParser.twemojiPath(this.emoji.unicode);
    },
  },
});
</script>

<style scoped>
.emoji {
  object-fit: contain;
  height: 1.4em;
  width: 1.4em;
  vertical-align: -7.5px;
  margin: 1px;
}
</style>
