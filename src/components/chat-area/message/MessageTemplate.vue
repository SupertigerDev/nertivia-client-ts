<template>
  <div
    class="message-container"
    @mouseover="hover = true"
    @mouseout="hover = false"
    @contextmenu.prevent="rightClickEvent"
  >
    <div class="container">
      <AvatarImage
        :imageId="creator.avatar"
        :willHaveClickEvent="true"
        :seedId="creator.uniqueID"
        :animateGif="hover"
        size="40px"
        v-if="!message.grouped"
        @click.native="showProfile"
      />
      <!-- Used for grouped messages -->
      <div class="time" v-else>{{ friendlyTime }}</div>
      <Bubble :message="message" />
      <MessageSide :message="message" />
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
import { PopoutsModule } from "@/store/modules/popouts";

@Component({
  components: { AvatarImage, Bubble, MessageSide }
})
export default class MessageLogs extends Vue {
  @Prop() private openContext!: boolean;
  @Prop() private message!: Message & { grouped: boolean };

  contextPos: { x?: number; y?: number } = {};
  hover = false;

  showProfile() {
    PopoutsModule.ShowPopout({
      id: "profile",
      component: "profile-popout",
      data: { uniqueID: this.creator.uniqueID }
    });
  }

  rightClickEvent(event: MouseEvent) {
    this.$emit("open-context");
    PopoutsModule.ShowPopout({
      id: "context",
      component: "MessageContextMenu",
      data: { x: event.pageX, y: event.pageY, message: this.message }
    });
  }
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
</style>

<style lang="scss">
.message-container:hover {
  .options-button {
    opacity: 1;
  }
}
</style>
