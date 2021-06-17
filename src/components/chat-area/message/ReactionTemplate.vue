<template>
  <div
    class="reaction"
    @mouseover="hover = true"
    @mouseleave="hover = false"
    :class="{ reacted: reaction.reacted }"
    @click="reactionClicked"
  >
    <div v-html="channelIconHTML"></div>
    {{ reaction.count }}
  </div>
</template>

<script lang="ts">
import Message, { Reaction } from "@/interfaces/Message";
import {
  addReaction,
  getReactedUsers,
  removeReaction
} from "@/services/messagesService";
import { MessagesModule } from "@/store/modules/messages";
import { PopoutsModule } from "@/store/modules/popouts";
import twemoji from "twemoji";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

@Component
export default class MessageSide extends Vue {
  @Prop() private reaction!: Reaction;
  @Prop() private message!: Message;
  hover = false;
  requestSent = false;
  timeout: number | null = null;

  getReactedUsers() {
    const rect = this.$el.getBoundingClientRect();
    PopoutsModule.ShowPopout({
      id: "reacted-users-preview",
      component: "ReactedUsersPreview",
      data: {
        channelID: this.message.channelID,
        messageID: this.message.messageID,
        unicode: this.reaction.unicode,
        emojiID: this.reaction.emojiID,
        x: rect.left,
        y: rect.top + rect.height + 5
      }
    });
  }

  reactionClicked() {
    if (!this.reaction.reacted) {
      this.addReaction();
      return;
    }
    this.removeReaction();
  }
  addReaction() {
    if (!this.message.messageID) return;
    if (this.requestSent) return;
    this.requestSent = true;
    MessagesModule.UpdateMessageReaction({
      channelID: this.message.channelID,
      messageID: this.message.messageID,
      reaction: { ...this.reaction, count: this.reaction.count + 1 },
      removeIfZero: false
    });
    addReaction(this.message.channelID, this.message.messageID, {
      emojiID: this.reaction.emojiID,
      gif: this.reaction.gif,
      unicode: this.reaction.unicode
    }).finally(() => (this.requestSent = false));
  }
  removeReaction() {
    if (!this.message.messageID) return;
    if (this.requestSent) return;
    this.requestSent = true;
    MessagesModule.UpdateMessageReaction({
      channelID: this.message.channelID,
      messageID: this.message.messageID,
      reaction: { ...this.reaction, count: this.reaction.count - 1 },
      removeIfZero: false
    });
    removeReaction(this.message.channelID, this.message.messageID, {
      emojiID: this.reaction.emojiID,
      unicode: this.reaction.unicode
    }).finally(() => (this.requestSent = false));
  }

  @Watch("hover")
  isHovered() {
    this.timeout && clearTimeout(this.timeout);
    if (this.hover) {
      this.timeout = setTimeout(() => this.getReactedUsers(), 500);
    } else {
      PopoutsModule.ClosePopout("reacted-users-preview");
    }
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
  }
}
</style>
<style>
.reaction .emoji {
  height: 1.5em;
  width: 1.5em;
}
</style>
