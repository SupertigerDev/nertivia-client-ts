<template>
  <div class="button" @click="click">
    <img class="spinner" v-if="posting" src="@/assets/spinner.svg" />
    <Markup :largeEmoji="false" :text="button.name" />
  </div>
</template>

<script lang="ts">
import Message, { Button } from "@/interfaces/Message";
import Markup from "@/components/Markup";
import { buttonClick } from "@/services/messagesService";
import { PopoutsModule } from "@/store/modules/popouts";
import { PropType } from "vue";
import { defineComponent } from "vue";
import { MESSAGE_BUTTON_CALLBACK } from "@/ServerEventNames";
export default defineComponent({
  name: "MessageSide",
  components: { Markup },
  props: {
    button: {
      type: Object as PropType<Button>,
      required: true,
    },
    message: {
      type: Object as PropType<Message>,
      required: true,
    },
  },
  data() {
    return {
      posting: false,
      timeout: null as number | null,
    };
  },
  unmounted() {
    this.$socket.off(MESSAGE_BUTTON_CALLBACK, this.onCallback);
  },
  methods: {
    click() {
      if (this.posting) return;
      if (!this.message.messageID) return;
      this.posting = true;

      this.$socket.once(MESSAGE_BUTTON_CALLBACK, this.onCallback);
      buttonClick(
        this.message.channelId,
        this.message.messageID,
        this.button.id
      );

      this.timeout = window.setTimeout(() => {
        this.posting = false;
      }, 20000);
    },
    onCallback(data: { id: string; message?: string }) {
      if (data.id !== this.button.id) return;
      this.posting = false;
      this.timeout && clearTimeout(this.timeout);
      if (data.message?.trim()) {
        PopoutsModule.ShowPopout({
          id: "custom-emoji-upload-error",
          component: "generic-popout",
          data: {
            title: this.button.name,
            description: data.message,
          },
        });
      }
    },
  },
});
</script>
<style lang="scss" scoped>
.button {
  display: flex;
  align-items: center;
  align-content: center;
  padding: 5px;
  font-size: 14px;
  height: 20px;
  color: rgba(255, 255, 255, 0.6);
  transition: 0.2s;
  user-select: none;
  cursor: pointer;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  margin-right: 1px;
  margin-top: 5px;
  &:hover {
    background: rgba(0, 0, 0, 0.4);
    color: white;
  }
}
.spinner {
  height: 20px;
  width: 20px;
}
</style>
