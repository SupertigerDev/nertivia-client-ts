<template>
  <div class="message-options">
    <span class="material-icons options-button" @click="messageContext">
      more_vert
    </span>
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
import { Component, Prop, Vue } from "vue-property-decorator";
import friendlyDate from "@/utils/date";
import { PopoutsModule } from "@/store/modules/popouts";
@Component
export default class MessageSide extends Vue {
  @Prop() private message!: Message & { grouped: boolean };
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
        tempUser: this.message.creator
      }
    });
  }
  get sendingStatus() {
    const sending = this.message.sending;
    if (sending === 0) return { icon: "query_builder", title: "Sending..." };
    if (this.message.timeEdited)
      return {
        icon: "edit",
        title: "Edited " + friendlyDate(this.message.timeEdited)
      };
    if (sending === 1) return { icon: "done", title: "Sent" };
    if (sending === 2) return { icon: "error_outline", title: "Not Sent" };
    return undefined;
  }
}
</script>
<style lang="scss" scoped>
.message-options {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  margin-left: 2px;
}

.options-button {
  font-size: 16px;
  opacity: 0;
  cursor: pointer;
  z-index: 1;
  user-select: none;
}
.message-status {
  font-size: 14px;
  margin: auto;
  margin-bottom: 0;
  user-select: none;
  cursor: default;
}
</style>
