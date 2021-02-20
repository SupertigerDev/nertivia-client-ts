<template>
  <div
    class="message-container"
    @mouseover="hover = true"
    @mouseout="hover = false"
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
        @contextmenu.native.prevent="userContext"
      />
      <!-- Used for grouped messages -->
      <div class="time" v-else>{{ friendlyTime }}</div>
      <Bubble :message="message" :invite="invite" />
      <MessageSide :message="message" v-if="!hideContext" />
    </div>
    <transition name="embed-animation">
      <EmbedMessage v-if="embed && !invite" :embed="embed" />
    </transition>
  </div>
</template>

<script lang="ts">
import Message from "@/interfaces/Message";
import { Component, Prop, Vue } from "vue-property-decorator";
import AvatarImage from "@/components/AvatarImage.vue";
import Bubble from "./Bubble.vue";
import MessageSide from "./MessageSide.vue";
import EmbedMessage from "./EmbedMessage.vue";
import { time } from "@/utils/date";
import { PopoutsModule } from "@/store/modules/popouts";

@Component({
  components: { AvatarImage, Bubble, MessageSide, EmbedMessage }
})
export default class MessageLogs extends Vue {
  @Prop() private message!: Message & { grouped: boolean };
  @Prop({ default: false }) private hideContext!: boolean;

  contextPos: { x?: number; y?: number } = {};
  hover = false;

  showProfile() {
    PopoutsModule.ShowPopout({
      id: "profile",
      component: "profile-popout",
      data: { uniqueID: this.creator.uniqueID }
    });
  }

  userContext(event: MouseEvent) {
    PopoutsModule.ShowPopout({
      id: "context",
      component: "UserContextMenu",
      key: this.message.creator.uniqueID + event.clientX + event.clientY,
      data: {
        x: event.clientX,
        y: event.clientY,
        tempUser: this.message.creator,
        uniqueID: this.message.creator.uniqueID
      }
    });
  }

  get invite() {
    const regex = /nertivia\.net\/(invites|i)\/([\S]+)/;
    if (!this.message.message) return null;
    return this.message.message.match(regex);
  }

  get creator() {
    return this.message.creator;
  }
  get friendlyTime() {
    return time(this.message.created);
  }
  get embed() {
    if (!this.message.embed) return undefined;
    if (!Object.keys(this.message.embed).length) return undefined;
    return this.message.embed;
  }
}
</script>

<style lang="scss" scoped>
.embed-animation-enter-active,
.embed-animation-leave-active {
  transition: 0.5s;
  transition-delay: 0.1s;
}
.embed-animation-enter,
.embed-animation-leave-to {
  transform: translateY(-30px);
  opacity: 0;
}

.message-container {
  display: flex;
  flex-direction: column;
  word-wrap: break-word;
  word-break: break-word;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  padding: 5px;
  padding-top: 3px;
  padding-bottom: 3px;
  overflow: hidden;
}
.container {
  overflow: hidden;
  display: flex;
}
.message {
  transition: background-color 0.2s;
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
