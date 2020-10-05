<template>
  <div class="message" @mouseover="hover = true" @mouseout="hover = false">
    <AvatarImage
      :imageId="creator.avatar"
      :seedId="creator.uniqueID"
      :animateGif="hover"
      size="40px"
    />
    <Bubble :message="message" />
  </div>
</template>

<script lang="ts">
import Message from "@/interfaces/Message";
import { Component, Prop, Vue } from "vue-property-decorator";
import AvatarImage from "@/components/AvatarImage.vue";
import Bubble from "./Bubble.vue";

@Component({ components: { AvatarImage, Bubble } })
export default class MessageLogs extends Vue {
  @Prop() private message!: Message;
  hover = false;

  get creator() {
    return this.message.creator;
  }
}
</script>

<style lang="scss" scoped>
.message {
  display: flex;
  word-wrap: break-word;
  word-break: break-word;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  margin: 10px;
  margin-top: 3px;
  margin-bottom: 3px;
}
</style>
