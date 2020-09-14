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
  white-space: break-spaces;
  line-break: anywhere;
  white-space: break-spaces;
  margin: 10px;
  margin-top: 3px;
  margin-bottom: 3px;
}
</style>
