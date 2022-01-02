<template>
  <img
    class="emoji custom-emoji"
    :title="emojiName"
    :alt="emojiName"
    :src="src"
  />
</template>

<script lang="ts">
import { useWindowProperties } from "@/utils/windowProperties";
const EMOJI_URL = process.env.VUE_APP_NERTIVIA_CDN + "emojis";

// todo: make CustomEmoji based on an Emoji class
import { defineComponent } from "vue";
export default defineComponent({
  props: {
    id: String,
    emojiName: String,
    animated: Boolean,
  },
  computed: {
    src(): string {
      return `${EMOJI_URL}/${this.id}.${this.animated ? "gif" : "png"}${
        !useWindowProperties().isFocused ? "?type=webp" : ""
      }`;
    },
  },
});
</script>

<style>
.emoji {
  object-fit: contain;
  height: 1.4em;
  width: 1.4em;
  vertical-align: -7.5px;
  margin: 1px;
}
</style>
