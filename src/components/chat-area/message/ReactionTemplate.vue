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
  removeReaction,
} from "@/services/messagesService";
import { MessagesModule } from "@/store/modules/messages";
import { PopoutsModule } from "@/store/modules/popouts";
import { emojiURL } from "@/utils/emojiParser";
import { PropType } from "vue";
import { defineComponent } from "vue";
export default defineComponent({
  name: "MessageSide",
  props: {
    reaction: {
      type: Object as PropType<Reaction>,
      required: true,
    },
    message: {
      type: Object as PropType<Message>,
      required: true,
    },
    animate: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      hover: false,
      requestSent: false,
      timeout: null as number | null,
    };
  },
  computed: {
    channelIconHTML(): any {
      const image = new Image();
      image.classList.add("emoji");
      let emoji = this.reaction.unicode || this.reaction.emojiID;

      if (emoji != null) {
        image.src = emojiURL(emoji, {
          animated: this.animate,
          isGif: this.reaction.gif,
          isCustom: this.reaction.emojiID != null,
        });
      } else {
        throw new Error(`AvatarImage is missing an icon to display`);
      }

      return image.outerHTML;
    },
  },
  watch: {
    hover: {
      handler: "isHovered",
    },
  },
  beforeUnmount() {
    PopoutsModule.ClosePopout("reacted-users-preview");
  },
  methods: {
    getReactedUsers() {
      const rect = this.$el.getBoundingClientRect();
      PopoutsModule.ShowPopout({
        id: "reacted-users-preview",
        component: "ReactedUsersPreview",
        data: {
          channelId: this.message.channelId,
          messageID: this.message.messageID,
          unicode: this.reaction.unicode,
          emojiID: this.reaction.emojiID,
          x: rect.left,
          y: rect.top + rect.height + 5,
        },
      });
    },
    reactionClicked() {
      if (!this.reaction.reacted) {
        this.addReaction();
        return;
      }
      this.removeReaction();
    },
    addReaction() {
      if (!this.message.messageID) return;
      if (this.requestSent) return;
      this.requestSent = true;
      MessagesModule.UpdateMessageReaction({
        channelId: this.message.channelId,
        messageID: this.message.messageID,
        reaction: { ...this.reaction, count: this.reaction.count + 1 },
        removeIfZero: false,
      });
      addReaction(this.message.channelId, this.message.messageID, {
        emojiID: this.reaction.emojiID,
        gif: this.reaction.gif,
        unicode: this.reaction.unicode,
      }).finally(() => (this.requestSent = false));
    },
    removeReaction() {
      if (!this.message.messageID) return;
      if (this.requestSent) return;
      this.requestSent = true;
      MessagesModule.UpdateMessageReaction({
        channelId: this.message.channelId,
        messageID: this.message.messageID,
        reaction: { ...this.reaction, count: this.reaction.count - 1 },
        removeIfZero: false,
      });
      removeReaction(this.message.channelId, this.message.messageID, {
        emojiID: this.reaction.emojiID,
        unicode: this.reaction.unicode,
      }).finally(() => (this.requestSent = false));
    },
    isHovered() {
      this.timeout && clearTimeout(this.timeout);
      if (this.hover) {
        this.timeout = window.setTimeout(() => this.getReactedUsers(), 500);
      } else {
        PopoutsModule.ClosePopout("reacted-users-preview");
      }
    },
  },
});
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
