<template>
  <div class="message-options">
    <span class="material-icons options-button">
      more_vert
    </span>
    <span class="material-icons message-status" v-if="sendingStatus">
      {{ sendingStatus }}
    </span>
  </div>
</template>

<script lang="ts">
import Message from "@/interfaces/Message";
import { Component, Prop, Vue } from "vue-property-decorator";
@Component
export default class MessageOptions extends Vue {
  @Prop() private message!: Message & { grouped: boolean };
  get sendingStatus() {
    const sending = this.message.sending;
    if (sending === undefined) return undefined;
    if (sending === 0) return "query_builder";
    if (sending === 1) return "done";
    if (sending === 2) return "error_outline";
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
  font-size: 14px;
  opacity: 0;
}
.message-status {
  font-size: 14px;
  margin: auto;
  margin-bottom: 0;
}
</style>
