<template>
  <div class="message" @mouseover="hover = true" @mouseout="hover = false">
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
  </div>
</template>

<script lang="ts">
import Message from "@/interfaces/Message";
import { Component, Prop, Vue } from "vue-property-decorator";
import AvatarImage from "@/components/AvatarImage.vue";
import Bubble from "./Bubble.vue";
import { time } from "@/utils/date";

@Component({ components: { AvatarImage, Bubble } })
export default class MessageLogs extends Vue {
  @Prop() private message!: Message & { grouped: boolean };
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
</style>
