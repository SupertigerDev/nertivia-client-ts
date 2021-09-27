<template>
  <div class="message-reactions">
    <ReactionTemplate
      v-for="reaction in message.reactions"
      :key="reaction.emojiID || reaction.unicode"
      :reaction="reaction"
      :message="message"
      :animate="animate"
    />
  </div>
</template>

<script lang="ts">
import Message from "@/interfaces/Message";
import ReactionTemplate from "./ReactionTemplate.vue";
import { PropType } from "vue";
import { defineComponent } from "vue";
export default defineComponent({
  name: "Reactions",
  components: { ReactionTemplate },
  props: {
    message: {
      type: Object as PropType<Message>,
      required: true,
    },
    animate: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    buttons(): any {
      return this.message.buttons;
    },
  },
});
</script>
<style lang="scss" scoped>
.message-reactions {
  display: flex;
  flex-wrap: wrap;
  margin-left: 15px;
  margin-top: -5px;
  z-index: 9999;
  background: var(--card-color);
  border: solid 1px rgba(255, 255, 255, 0.1);
  border-radius: 8px;
}
</style>
