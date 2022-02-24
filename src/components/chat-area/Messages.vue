<template>
  <transition-group :name="animateMessage ? 'message' : ''" tag="div">
    <component
      v-for="msg in messages"
      :key="msg.message.tempID || msg.message.messageID"
      :message="msg.message"
      :grouped="msg.grouped"
      :is="msg.Component"
    />
  </transition-group>
</template>

<script lang="tsx">
import { MessagesModule } from "@/store/modules/messages";
import MessageTemplate from "./message/MessageTemplate.vue";
import ActionMessageTemplate from "./message/ActionMessageTemplate.vue";
import { defineComponent, computed, onBeforeUnmount } from "vue";
import Message from "@/interfaces/Message";

export default defineComponent({
  props: {
    channelId: {
      type: String,
      required: true,
    },
    animateMessage: Boolean,
  },
  setup(props) {
    const isMoreThanMinute = (before: Message, after: Message) => {
      const minute = 60000;
      const beforeTime = before.created;
      const afterTime = after.created;
      return afterTime - beforeTime > minute;
    };

    onBeforeUnmount(() => {
      MessagesModule.deselectAll();
    });

    const creatorMatch = (before: Message, after: Message) =>
      before.creator.id === after.creator.id;

    const messageComponent = (grouped: boolean, message: Message) => {
      const Component =
        message.type === 0 || !message.type
          ? MessageTemplate
          : ActionMessageTemplate;
      return { Component, message, grouped };
    };

    const messages = computed(() => {
      const messages = MessagesModule.messages[props.channelId];

      let groupCount = 0;

      return messages.map((m, index) => {
        const beforeMessage = messages[index - 1];

        if (!beforeMessage || !creatorMatch(beforeMessage, m)) {
          groupCount = 0;
          return messageComponent(false, m);
        }

        if (groupCount >= 4 || isMoreThanMinute(beforeMessage, m)) {
          groupCount = 0;
          return messageComponent(false, m);
        }
        groupCount += 1;
        return messageComponent(true, m);
      });
    });

    return { messages };
  },
});
</script>

<style scoped lang="scss">
.message-enter-active {
  transition: all 0.5s;
}
.message-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}
</style>
