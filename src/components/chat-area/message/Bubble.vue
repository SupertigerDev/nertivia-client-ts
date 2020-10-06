<template>
  <div
    class="bubble"
    :class="{ me: isMessageCreatedByMe, grouped: message.grouped }"
  >
    <div class="details" v-if="!message.grouped">
      <div class="username">{{ creator.username }}</div>
      <div class="date">{{ date }}</div>
    </div>
    <div class="message">{{ message.message }}</div>
  </div>
</template>

<script lang="ts">
import Message from "@/interfaces/Message";
import { MeModule } from "@/store/modules/me";
import { Component, Prop, Vue } from "vue-property-decorator";
import friendlyDate from "@/utils/date";
@Component
export default class Bubble extends Vue {
  @Prop() private message!: Message & { grouped: boolean };
  get creator() {
    return this.message.creator;
  }
  get isMessageCreatedByMe() {
    return this.message.creator.uniqueID === MeModule.user.uniqueID;
  }
  get date() {
    return friendlyDate(this.message.created);
  }
}
</script>
<style lang="scss" scoped>
$pointer-size: 10px;

.bubble {
  position: relative;
  background: var(--others-chat-bubble-color);
  border-radius: 4px;
  border-top-left-radius: 0;
  margin-left: 10px;
  padding: 5px;
  &::after {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: 0;
    height: 0;

    border: $pointer-size solid transparent;

    border-right-color: var(--others-chat-bubble-color);
    border-left: 0;
    border-top: 0;
    margin-left: -$pointer-size;
  }
  &.me {
    background: var(--my-chat-bubble-color);
    &::after {
      border-right-color: var(--my-chat-bubble-color);
    }
  }
  &.grouped {
    border-radius: 4px;
  }
  &.grouped:after {
    border-color: transparent;
  }
}

.details {
  display: flex;
  align-items: center;
  align-content: center;
  margin-bottom: 3px;
  .username {
    font-weight: bold;
    font-size: 14px;
  }
  .date {
    opacity: 0.6;
    font-size: 12px;
    margin-left: 5px;
  }
}
</style>
