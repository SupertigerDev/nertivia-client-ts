<template>
  <div
    class="channel"
    :class="{ selected, hasIcon: iconURL != null }"
    :style="channelStyle"
  >
    <picture class="icon" aria-hidden="true" />
    <div class="name">{{ item.name }}</div>
  </div>
</template>

<script lang="ts">
import Channel from "@/interfaces/Channel";
import { emojiURL } from "@/utils/emojiParser";
import { PropType } from "vue";
import { defineComponent } from "vue";
export default defineComponent({
  name: "ChannelSuggestionTemplate",
  props: {
    item: {
      type: Object as PropType<Channel>,
      required: true,
    },
    selected: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    iconURL(): any {
      const icon = this.item.icon;
      if (!icon) return null;
      const isCustom = icon.startsWith("g_") || icon.startsWith("c_");
      const isGif = icon.startsWith("g_");
      const customEmojiID = icon.split("_")[1];
      return emojiURL(isCustom ? customEmojiID : icon, { isCustom, isGif });
    },
    channelStyle(): any {
      return {
        "--icon-url": this.iconURL && `url("${this.iconURL}")`,
      };
    },
  },
});
</script>
<style scoped lang="scss">
.channel {
  display: grid;
  grid-template-columns: 1rem 1fr;
  grid-template-rows: min-content;
  gap: 0.25rem;

  align-content: center;

  block-size: 2rem;
  content-visibility: auto;
  contain-intrinsic-size: 2rem;

  padding-inline: 0.5rem 0.5rem;

  border-inline-start: 3px solid transparent;

  color: rgb(255 255 255 / 0.7);

  cursor: pointer;
  user-select: none;
  white-space: nowrap;
  text-decoration: none;
  overflow: hidden;

  &.selected {
    background: var(--primary-color);
    color: white;
  }
}

.icon {
  overflow: hidden;
  align-self: center;
  justify-self: center;

  display: flex;
}

.channel:not(.hasIcon) .icon {
  width: 0.5rem;
  height: 0.5rem;
  background: currentColor;
  border-radius: 100%;
}

.hasIcon .icon {
  width: 1rem;
  height: 1rem;
  background-image: var(--icon-url);
  background-size: cover;
}

.name {
  position: relative;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
