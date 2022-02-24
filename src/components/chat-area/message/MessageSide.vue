<template>
  <div class="message-options">
    <div class="buttons">
      <span class="material-icons button" @click="messageContext">
        more_vert
      </span>
      <span class="material-icons button" @click="openReaction">
        add_reaction
      </span>
    </div>
    <span
      class="material-icons message-status"
      v-if="sendingStatus"
      :title="sendingStatus.title"
    >
      {{ sendingStatus.icon }}
    </span>
  </div>
</template>

<script lang="ts">
import Message from "@/interfaces/Message";
import friendlyDate from "@/utils/date";
import { PopoutsModule } from "@/store/modules/popouts";
import { PropType } from "vue";
import { defineComponent } from "vue";
export default defineComponent({
  name: "MessageSide",
  props: {
    message: {
      type: Object as PropType<Message>,
      required: true,
    },
  },
  computed: {
    sendingStatus(): any {
      const sending = this.message.sending;
      if (sending === 0) return { icon: "query_builder", title: "Sending..." };
      if (this.message.timeEdited)
        return {
          icon: "edit",
          title:
            "Edited " +
            friendlyDate(this.message.timeEdited, localStorage["timeFormat"]),
        };
      if (sending === 1) return { icon: "done", title: "Sent" };
      if (sending === 2) return { icon: "error_outline", title: "Not Sent" };
      return undefined;
    },
  },
  methods: {
    messageContext(event: MouseEvent) {
      const id = this.message.tempID || this.message.messageID || "";
      PopoutsModule.ShowPopout({
        id: "context",
        component: "MessageContextMenu",
        key: id + event.pageX + event.pageY,
        data: {
          x: event.pageX,
          y: event.pageY,
          message: this.message,
          tempUser: this.message.creator,
          element: event.target,
        },
      });
    },
    openReaction(event: MouseEvent) {
      PopoutsModule.ShowPopout({
        id: "message-reaction-picker",
        component: "MessageReactionEmojiPicker",
        data: {
          messageID: this.message.messageID,
          channelId: this.message.channelId,
          x: event.pageX,
          y: event.pageY,
        },
      });
    },
  },
});
</script>
<style lang="scss" scoped>
.message-options {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  margin-left: 2px;
  user-select: none;
  transform: rotate(0.3deg);
}

.buttons {
  opacity: 0;
  transition: 0.2s;
}
.button {
  font-size: 16px;
  opacity: 0.4;
  cursor: pointer;
  z-index: 1;
  user-select: none;
  padding: 1px;
  border-radius: 4px;
  transition: 0.2s;
  &:hover {
    opacity: 1;
    background: var(--primary-color);
  }
}
.message-status {
  font-size: 14px;
  margin: auto;
  margin-left: 2px;
  margin-bottom: 0;
  user-select: none;
  cursor: default;
}
</style>

<style lang="scss">
.message:hover {
  .buttons {
    opacity: 1;
  }
}
</style>
