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
import { PropType } from "vue";
import { defineComponent } from "vue";
export default defineComponent({
  name: "MessageSide",
  components: { ButtonTemplate },
  props: {
    message: {
      type: Object as PropType<Message>,
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
.message-buttons {
  display: flex;
  flex-wrap: wrap;
  margin-left: 10px;
}
</style>
