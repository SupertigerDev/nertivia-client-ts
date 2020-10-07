<template>
  <div
    class="message-container"
    @mouseover="hover = true"
    @mouseout="hover = false"
    @contextmenu.prevent="$emit('show-options')"
  >
    <div class="container">
      <AvatarImage
        :imageId="creator.avatar"
        :seedId="creator.uniqueID"
        :animateGif="hover"
        size="40px"
        v-if="!message.grouped"
      />
      <!-- Used for grouped messages -->
      <div class="time" v-else>{{ friendlyTime }}</div>
      <Bubble :message="message" />
      <MessageSide :message="message" />
    </div>
    <div class="options" :class="{ show: showOptions }">
      <div class="button">Copy</div>
      <div class="button">Edit</div>
      <div class="button">Delete</div>
    </div>
  </div>
</template>

<script lang="ts">
import Message from "@/interfaces/Message";
import { Component, Prop, Vue } from "vue-property-decorator";
import AvatarImage from "@/components/AvatarImage.vue";
import Bubble from "./Bubble.vue";
import MessageSide from "./MessageSide.vue";
import { time } from "@/utils/date";

@Component({ components: { AvatarImage, Bubble, MessageSide } })
export default class MessageLogs extends Vue {
  @Prop() private message!: Message & { grouped: boolean };
  @Prop() private showOptions!: boolean;
  hover = false;

  get creator() {
    return this.message.creator;
  }
  get friendlyTime() {
    return time(this.message.created);
  }
}
</script>

<style lang="scss" scoped>
.message-container {
  display: flex;
  flex-direction: column;
  word-wrap: break-word;
  word-break: break-word;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  padding: 10px;
  padding-top: 3px;
  padding-bottom: 3px;
  transition: 0.2s;
}
.container {
  display: flex;
}
.message:hover {
  .time {
    opacity: 0.8;
  }
}
.time {
  width: 40px;
  opacity: 0;
  font-size: 14px;
  align-self: center;
  flex-shrink: 0;
  transition: 0.2s;
}
.options {
  display: flex;
  align-items: center;
  align-content: center;

  height: 0;
  opacity: 0;
  transition: 0.2s;
  margin-left: 45px;
  &.show {
    opacity: 1;
    height: 20px;
    margin-top: 5px;
  }
}
.button {
  margin-left: 5px;
  cursor: pointer;
  opacity: 0.7;
  &:hover {
    opacity: 1;
  }
}
</style>

<style lang="scss">
.message-container:hover {
  .options-button {
    opacity: 1;
  }
}
</style>
