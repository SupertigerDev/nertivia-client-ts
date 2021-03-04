<template>
  <div class="message-buttons">
    <ButtonTemplate
      v-for="button in buttons"
      :key="button.id"
      :button="button"
      :message="message"
    />
  </div>
</template>

<script lang="ts">
import Message from "@/interfaces/Message";
import ButtonTemplate from "./ButtonTemplate.vue";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({ components: { ButtonTemplate } })
export default class MessageSide extends Vue {
  @Prop() private message!: Message;
  get buttons() {
    return this.message.buttons;
  }
}
</script>
<style lang="scss" scoped>
.message-buttons {
  display: flex;
  flex-wrap: wrap;
  margin-left: 10px;
}
</style>
