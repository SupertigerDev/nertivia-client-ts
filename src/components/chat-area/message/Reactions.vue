<template>
  <div class="message-reactions">
    <ReactionTemplate
      v-for="reaction in message.reactions"
      :key="reaction.emojiID || reaction.unicode"
      :reaction="reaction"
      :message="message"
    />
  </div>
</template>

<script lang="ts">
import Message from "@/interfaces/Message";
import ReactionTemplate from "./ReactionTemplate.vue";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({ components: { ReactionTemplate } })
export default class Reactions extends Vue {
  @Prop() private message!: Message;
  get buttons() {
    return this.message.buttons;
  }
}
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
