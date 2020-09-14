<template>
  <div class="bubble" :class="{ me: isMessageCreatedByMe }">
    <div class="details">
      <div class="username">{{ creator.username }}</div>
      <div class="date">{{ message.created }}</div>
    </div>
    <div class="message">{{ message.message }}</div>
  </div>
</template>

<script lang="ts">
import Message from "@/interfaces/Message";
import { MeModule } from "@/store/modules/me";
import { Component, Prop, Vue } from "vue-property-decorator";
@Component
export default class Bubble extends Vue {
  @Prop() private message!: Message;
  get creator() {
    return this.message.creator;
  }
  get isMessageCreatedByMe() {
    return this.message.creator.uniqueID === MeModule.user.uniqueID;
  }
}
</script>
<style lang="scss" scoped>
@import "@/styles/global.scss";
$pointer-size: 10px;
$message-background-color: #3a4750;
$my-message-background-color: $primary-color;
// $my-message-background-color: #00aabb;

.bubble {
  position: relative;
  background: $message-background-color;
  border-radius: 4px;
  border-top-left-radius: 0;
  margin-left: 10px;
  padding: 5px;
  color: white;
  &::after {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: 0;
    height: 0;

    border: $pointer-size solid transparent;

    border-right-color: $message-background-color;
    border-left: 0;
    border-top: 0;
    margin-left: -$pointer-size;
  }
  &.me {
    background: $my-message-background-color;
    &::after {
      border-right-color: $my-message-background-color;
    }
  }
}

.details {
  display: flex;
  .date {
    opacity: 0.8;
    font-size: 14px;
    margin-left: 5px;
  }
}
</style>
