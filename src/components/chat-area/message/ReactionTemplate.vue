<template>
  <div
    class="reaction"
    :class="{ reacted: reaction.reacted }"
    @click="reactionClicked"
  >
    <div v-html="channelIconHTML"></div>
    {{ reaction.count }}
  </div>
</template>

<script lang="ts">
import Message, { Reaction } from "@/interfaces/Message";
import { addReaction, removeReaction } from "@/services/messagesService";
import twemoji from "twemoji";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class MessageSide extends Vue {
  @Prop() private reaction!: Reaction;
  @Prop() private message!: Message;
  hover = true;

  reactionClicked() {
    if (!this.reaction.reacted) {
      this.addReaction();
      return;
    }
    this.removeReaction();
  }
  addReaction() {
    if (!this.message.messageID) return;
    addReaction(this.message.channelID, this.message.messageID, {
      emojiID: this.reaction.emojiID,
      gif: this.reaction.gif,
      unicode: this.reaction.unicode
    });
  }
  removeReaction() {
    if (!this.message.messageID) return;
    removeReaction(this.message.channelID, this.message.messageID, {
      emojiID: this.reaction.emojiID,
      unicode: this.reaction.unicode
    });
  }

  get channelIconHTML() {
    const isCustom = this.reaction.emojiID;
    const isGif = this.reaction.gif;

    const image = new Image();
    image.classList.add("emoji");

    if (isCustom) {
      image.src = `${process.env.VUE_APP_NERTIVIA_CDN}emojis/${
        this.reaction.emojiID
      }.${isGif ? "gif" : "png"}${!this.hover && isGif ? "?type=webp" : ""}`;
    } else {
      if (!this.reaction.unicode) return image;
      image.src =
        process.env.VUE_APP_TWEMOJI_LOCATION +
        twemoji.convert
          .toCodePoint(this.reaction.unicode)
          .replace("-fe0f", "") +
        ".svg";
    }

    return image.outerHTML;
  }
}
</script>
<style lang="scss" scoped>
.reaction {
  display: flex;
  align-items: center;
  align-content: center;
  font-size: 14px;
  padding: 3px;
  height: 20px;
  color: rgba(255, 255, 255, 0.6);
  transition: 0.2s;
  user-select: none;
  cursor: pointer;
  border-radius: 8px;
  margin-right: 1px;

  &.reacted {
    color: var(--primary-color);
  }
  &:hover {
    background: rgba(0, 0, 0, 0.4);
    color: var(--primary-color);
  }
}
</style>
