<template>
  <div class="button" @click="click">
    <img class="spinner" v-if="posting" src="@/assets/spinner.svg" />
    <Markup :text="button.name" />
  </div>
</template>

<script lang="ts">
import Message, { Button } from "@/interfaces/Message";
import Markup from "@/components/Markup.vue";
import { buttonClick } from "@/services/messagesService";
import { PopoutsModule } from "@/store/modules/popouts";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({ components: { Markup } })
export default class MessageSide extends Vue {
  @Prop() private button!: Button;
  @Prop() private message!: Message;
  posting = false;
  timeout: NodeJS.Timeout | null = null;
  click() {
    if (this.posting) return;
    if (!this.message.messageID) return;
    this.posting = true;
    this.$socket.client.once("message_button_click_callback", this.onCallback);
    buttonClick(this.message.channelID, this.message.messageID, this.button.id);

    this.timeout = setTimeout(() => {
      this.posting = false;
    }, 20000);
  }
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
          description: data.message
        }
      });
    }
  }
  destroyed() {
    this.$socket.client.off("message_button_click_callback", this.onCallback);
  }
}
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
