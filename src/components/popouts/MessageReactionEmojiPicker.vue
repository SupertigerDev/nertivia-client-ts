<template>
  <div
    class="context"
    @contextmenu.prevent
    :style="clampPos"
    v-click-outside="clickOutside"
  >
    <div class="content">
      <PickerArea
        defaultTab="EMOJI"
        :hideTabs="true"
        @click="emojiPicked"
        class="emoji-picker"
      />
    </div>
  </div>
</template>

<script lang="ts">
import PickerArea from "@/components/picker-area/PickerArea.vue";
import { useWindowProperties } from "@/utils/windowProperties";
import { PopoutsModule } from "@/store/modules/popouts";
import { addReaction } from "@/services/messagesService";
import { MessagesModule } from "@/store/modules/messages";
import { Reaction } from "@/interfaces/Message";
import { PropType } from "vue";

interface IProp {
  messageID: string;
  channelId: string;
  x: number;
  y: number;
}

import { defineComponent } from "vue";
export default defineComponent({
  name: "MessageReactionEmojiPicker",
  components: { PickerArea },
  props: {
    data: {
      type: Object as PropType<IProp>,
      required: true,
    },
    identity: {
      type: String,
      required: true,
    },
  },
  computed: {
    clampPos(): any {
      const top = this.data.y || 0;
      const left = this.data.x || 0;

      // prevent from going bottom of the screen
      const heightPos = 354 + top;
      const clampedTop =
        this.clamp(heightPos, 0, this.windowDiamentions.height) - 354;
      // prevent from going right of the screen
      const widthPos = 377 + left;
      const clampedLeft =
        this.clamp(widthPos, 0, this.windowDiamentions.width) - 377;

      return {
        top: clampedTop + "px",
        left: clampedLeft + "px",
      };
    },
    windowDiamentions(): any {
      const { resizeHeight, resizeWidth } = useWindowProperties();
      return {
        height: resizeHeight,
        width: resizeWidth,
      };
    },
  },
  methods: {
    clickOutside(event: any) {
      if (event.target.closest(".context")) return;
      PopoutsModule.ClosePopout(this.identity);
    },
    emojiPicked(event: { unicode: string; gif: boolean; id: string }) {
      PopoutsModule.ClosePopout(this.identity);

      const reactions = MessagesModule.messageReactions({
        messageID: this.data.messageID,
        channelId: this.data.channelId,
      });

      if (reactions && reactions?.length > 10) {
        PopoutsModule.ShowPopout({
          id: "add-reaction-limit-reached",
          component: "generic-popout",
          data: {
            title: "Reaction Limit",
            description: "Reaction limit reached for this message.",
          },
        });
        return;
      }

      let oldReaction: Reaction | undefined = MessagesModule.messageReaction({
        messageID: this.data.messageID,
        channelId: this.data.channelId,
        emojiID: event.id,
        unicode: event.unicode,
      });
      if (oldReaction && oldReaction.reacted) return;
      if (!oldReaction) {
        oldReaction = {
          count: 0,
          emojiID: event.id,
          unicode: event.unicode,
          gif: event.gif,
          reacted: false,
        };
      }

      MessagesModule.UpdateMessageReaction({
        channelId: this.data.channelId,
        messageID: this.data.messageID,
        reaction: { ...oldReaction, count: oldReaction.count + 1 },
        removeIfZero: false,
      });

      addReaction(this.data.channelId, this.data.messageID, {
        emojiID: event.id,
        gif: event.gif,
        unicode: event.unicode,
      });
    },
    clamp(num: number, min: number, max: number) {
      return num <= min ? min : num >= max ? max : num;
    },
  },
});
</script>

<style scoped></style>

<style lang="scss" scoped>
.context {
  pointer-events: all;
  position: absolute;
  border-radius: 4px;
  z-index: 99999999999;
}
.content {
  display: flex;
  flex-direction: column;
}
.emoji-picker {
  position: relative;
  bottom: initial;
  right: initial;
}
</style>
