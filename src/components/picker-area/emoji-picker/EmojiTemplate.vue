<template>
  <div class="emoji-item" :class="{ add: addEmojiButton }">
    <div class="emoji" v-if="addEmojiButton">
      <div class="material-icons">add</div>
    </div>
    <div
      v-else-if="!emoji.id"
      class="emoji default"
      :style="{ backgroundPosition: emoji.pos }"
    />
    <div
      v-else
      class="emoji custom"
      :style="{
        backgroundImage: `url(${customEmojiUrl + emoji.id}.${
          emoji.gif ? 'gif' : 'png'
        })`,
      }"
    />
  </div>
</template>

<script lang="tsx">
import { defineComponent } from "vue";

export default defineComponent({
  props: ["emoji", "addEmojiButton"],
  data() {
    return {
      customEmojiUrl: process.env.VUE_APP_NERTIVIA_CDN + "emojis/",
    };
  },
});
</script>

<style lang="scss" scoped>
.emoji-item {
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  height: 37px;
  border-radius: 4px;
  width: 37px;
  flex-shrink: 0;
  cursor: pointer;
  transition: 0.2s;
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
  &.add {
    opacity: 0.6;
    &:hover {
      opacity: 0.8;
    }
  }
}
.emoji {
  &.default {
    background-image: url("../../../assets/emojiSprites.png");
    background-position: 0px 0px;
    background-repeat: no-repeat;
    background-size: 1000px;
  }
  user-select: none;
  height: 25px;
  width: 25px;
  flex-shrink: 0;
  &.custom {
    background-size: contain;
    background-position: center;
  }
}
</style>
