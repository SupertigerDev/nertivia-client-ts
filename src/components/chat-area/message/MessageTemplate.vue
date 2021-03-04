<template>
  <div
    class="message message-container"
    :id="'message-' + message.messageID"
    @mouseover="hover = true"
    @mouseleave="hover = false"
  >
    <div class="container">
      <AvatarImage
        class="avatar"
        :imageId="creator.avatar"
        :willHaveClickEvent="true"
        :seedId="creator.uniqueID"
        :animateGif="hover"
        size="40px"
        v-if="!grouped"
        @click.native="showProfile"
        @contextmenu.native.prevent="userContext"
      />
      <!-- Used for grouped messages -->
      <div class="time" v-else>{{ friendlyTime }}</div>
      <div class="inner-content">
        <div class="bubble-wrapper">
          <Bubble :message="message" :invite="invite" :grouped="grouped" />
          <MessageSide :message="message" v-if="!hideContext" />
        </div>
        <ButtonsMessage
          v-if="message.buttons && message.buttons.length"
          :message="message"
        />
        <div class="local-message-warn" v-if="message.localMessage">
          <span>This is a local message. Only you can see this message.</span>
        </div>
      </div>
    </div>

    <transition name="embed-animation">
      <HTMLEmbed v-if="message.htmlEmbed" :compressedJSON="message.htmlEmbed" />
      <EmbedMessage v-else-if="embed && !invite" :embed="embed" />
    </transition>
  </div>
</template>

<script lang="ts">
import Message from "@/interfaces/Message";
import { Component, Prop, Vue } from "vue-property-decorator";
import AvatarImage from "@/components/AvatarImage.vue";
import Bubble from "./Bubble.vue";
import MessageSide from "./MessageSide.vue";
import ButtonsMessage from "./ButtonsMessage.vue";
import EmbedMessage from "./EmbedMessage.vue";
import { time } from "@/utils/date";
import { PopoutsModule } from "@/store/modules/popouts";
import HTMLEmbed from "./HTMLEmbed.vue";

@Component({
  components: {
    AvatarImage,
    Bubble,
    MessageSide,
    EmbedMessage,
    HTMLEmbed,
    ButtonsMessage
  }
})
export default class MessageLogs extends Vue {
  @Prop() private message!: Message;
  @Prop() private grouped!: boolean;
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

.avatar {
  align-self: flex-start;
}
.message-container {
  display: flex;
  flex-direction: column;
  word-wrap: break-word;
  word-break: break-word;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  padding: 5px;
  padding-left: 10px;
  padding-top: 3px;
  padding-bottom: 3px;
  overflow: hidden;
}
.container {
  overflow: hidden;
  display: flex;
}
.bubble-wrapper {
  overflow: hidden;
  display: flex;
}
.inner-content {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-content: flex-start;
  align-items: flex-start;
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
.local-message-warn {
  font-size: 14px;
  margin-left: 10px;
  margin-top: 3px;
  opacity: 0.6;
}
</style>

<style lang="scss">
.message-container:hover {
  .options-button {
    opacity: 1;
  }
}
</style>
