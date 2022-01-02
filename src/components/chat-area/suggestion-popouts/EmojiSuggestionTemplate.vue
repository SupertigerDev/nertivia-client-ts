<template>
  <div class="emoji-suggestion-template" :class="{ selected }">
    <div class="emoji" v-html="image"></div>
    <div class="name">{{ name }}</div>
  </div>
</template>

<script lang="ts">
import emojiParser from "@/utils/emojiParser";
import { defineComponent } from "vue";
export default defineComponent({
  name: "EmojiSuggestionTemplate",
  props: {
    item: {
      type: Object as any,
      required: true,
    },
    selected: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    image(): any {
      if (this.item.unicode) {
        return emojiParser.replaceEmojis(this.item.unicode);
      }
      const image = new Image();
      image.classList.add("emoji");

      image.src = `${process.env.VUE_APP_NERTIVIA_CDN}emojis/${
        this.item.id
      }.${this.item.gif ? "gif" : "png"}`;
      return image.outerHTML;
    },
    name(): any {
      return this.item.name || this.item.shortcodes[0];
    },
  },
});
</script>
<style scoped lang="scss">
.emoji-suggestion-template {
  display: flex;
  align-items: center;
  align-content: center;
  height: 25px;
  cursor: pointer;
  user-select: none;
  color: rgba(255, 255, 255, 0.6);
  &.selected {
    background: var(--primary-color);
    color: white;
  }
}

.emoji {
  margin-left: 5px;
  margin-right: 5px;
  height: 20px;
  flex-shrink: 0;
  width: 20px;
}

.name {
  margin-right: 5px;
}
</style>
<style>
.emoji-suggestion-template .emoji img {
  object-fit: cover;
  height: 100%;
  width: 100%;
  margin: 0;
  vertical-align: initial;
}
</style>
