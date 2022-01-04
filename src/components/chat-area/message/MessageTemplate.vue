<template>
  <div
    class="message message-container"
    :id="'message-' + message.messageID"
    @mouseover="hover = true"
    @mouseleave="hover = false"
    @contextmenu="messageContext"
    @dblclick="onDoubleClick"
  >
    <div
      class="container blocked"
      v-if="isBlocked"
      @click="viewBlockedMessage = true"
    >
      Blocked message. Click to view.
    </div>
    <div class="container" v-else>
      <CheckBox
        v-if="showCheckbox"
        :class="{ disableCheckmark: !canDeleteMessage }"
        :modelValue="isSelected"
        @click="onCheckBoxClick"
      />
      <AvatarImage
        class="avatar"
        :imageId="creator.avatar"
        :willHaveClickEvent="true"
        :seedId="creator.id"
        :animateGif="hover"
        :badges="creator.badges"
        size="40px"
        v-if="!grouped"
        @click="showProfile"
        @contextmenu.prevent="userContext"
      />
      <!-- Used for grouped messages -->
      <div class="time" v-else>{{ friendlyTime }}</div>
      <div class="inner-content">
        <div class="bubble-wrapper">
          <Bubble :message="message" :invite="invite" :grouped="grouped" />
          <MessageSide :message="message" v-if="!hideContext" />
        </div>
        <Reactions
          v-if="message.reactions && message.reactions.length"
          :animate="hover"
          :message="message"
        />
        <ButtonsMessage
          v-if="message.buttons && message.buttons.length"
          :message="message"
        />
        <div class="local-message-warn" v-if="message.localMessage">
          <span>This is a local message. Only you can see this message.</span>
        </div>
      </div>
    </div>

    <transition name="embed-animation" v-if="!isBlocked">
      <HTMLEmbed v-if="message.message && message.htmlEmbed" :leftPadding="true" :compressedJSON="message.htmlEmbed" />
      <EmbedMessage v-else-if="embed && !invite" :embed="embed" />
    </transition>
  </div>
</template>

<script lang="ts">
import Message, { UserExtra } from "@/interfaces/Message";
import AvatarImage from "@/components/AvatarImage.vue";
import Bubble from "./Bubble.vue";
import MessageSide from "./MessageSide.vue";
import ButtonsMessage from "./ButtonsMessage.vue";
import Reactions from "./Reactions.vue";
import EmbedMessage from "./EmbedMessage.vue";
import { time } from "@/utils/date";
import { PopoutsModule } from "@/store/modules/popouts";
import HTMLEmbed from "./HTMLEmbed.vue";
import { UsersModule } from "@/store/modules/users";
import { PropType } from "vue";
import User from "@/interfaces/User";
import { defineComponent } from "vue";
import CheckBox from "@/components/CheckBox.vue";
import { MessagesModule } from "@/store/modules/messages";
import { MeModule } from "@/store/modules/me";
import { permissions } from "@/constants/rolePermissions";
import { ServerMembersModule } from "@/store/modules/serverMembers";
import { ServersModule } from "@/store/modules/servers";
export default defineComponent({
  name: "MessageLogs",
  components: {
    AvatarImage,
    Bubble,
    MessageSide,
    EmbedMessage,
    HTMLEmbed,
    ButtonsMessage,
    Reactions,
    CheckBox,
  },
  props: {
    message: {
      type: Object as PropType<Message>,
      required: true,
    },
    grouped: {
      type: Boolean,
      required: true,
    },
    hideContext: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      contextPos: {} as { x?: number; y?: number },
      hover: false,
      viewBlockedMessage: false,
    };
  },
  computed: {
    canDeleteMessage(): any {
      if (!this.message.messageID) return false;
      if (this.message.localMessage) return false;
      if (this.messageCreatedByMe) return true;
      if (!this.serverID) return false;
      if (this.isServerOwner) return true;
      if (!MeModule.user.id) return false;
      return ServerMembersModule.memberHasPermission(
        MeModule.user.id,
        this.serverID,
        permissions.ADMIN.value
      );
    },
    messageCreatedByMe(): any {
      return MeModule.user.id === this.message.creator.id;
    },
    isServerOwner(): any {
      if (!this.serverID) return false;
      const server = ServersModule.servers[this.serverID];
      return MeModule.user.id === server.creator.id;
    },
    serverID(): any {
      if (this.currentTab !== "servers") return undefined;
      return this.$route.params.server_id;
    },
    currentTab(): any {
      return this.$route.path.split("/")[2];
    },
    showCheckbox() {
      return MessagesModule.selectedMessageIds.length;
    },
    isSelected() {
      if (!this.message.messageID) return false;
      return MessagesModule.isMessageSelected(this.message.messageID);
    },
    invite(): any {
      const inviteLinkRegex = new RegExp(
        `${process.env.VUE_APP_MAIN_APP_URL}(invites|i)/([\\S]+)`
      );
      if (!this.message.message) return null;
      return this.message.message.match(inviteLinkRegex);
    },
    creator(): User & UserExtra {
      return this.message.creator;
    },
    friendlyTime(): any {
      return time(this.message.created, localStorage["timeFormat"]);
    },
    embed(): any {
      if (!this.message.embed) return undefined;
      if (!Object.keys(this.message.embed).length) return undefined;
      return this.message.embed;
    },
    isBlocked(): any {
      return (
        !this.viewBlockedMessage &&
        UsersModule.blockedUserIDArr.includes(this.message.creator.id)
      );
    },
  },
  methods: {
    selectMessage() {
      if (!this.message.messageID) return;
      if (!this.canDeleteMessage && !this.isSelected) return;
      if (this.isSelected) {
        MessagesModule.unselectMessage(this.message.messageID);
        return;
      }
      MessagesModule.selectMessage(this.message.messageID);
    },
    onDoubleClick(event: MouseEvent & { target: HTMLElement }) {
      const whitelistArr = [".date", ".time"];
      const closest = this.elementClosestInArray(event.target, whitelistArr);
      if (!closest) return;
      this.selectMessage();
    },
    onCheckBoxClick() {
      this.selectMessage();
    },
    showProfile() {
      PopoutsModule.ShowPopout({
        id: "profile",
        component: "profile-popout",
        data: { id: this.creator.id },
      });
    },
    messageContext(event: MouseEvent & { target: HTMLElement }) {
      if (this.$isMobile) return;
      const whitelistArr = [".message-content", ".date", ".time"];
      const closest = this.elementClosestInArray(event.target, whitelistArr);
      if (!closest) return;
      event.preventDefault();
      const id = this.message.tempID || this.message.messageID || "";
      PopoutsModule.ShowPopout({
        id: "context",
        component: "MessageContextMenu",
        key: id + event.pageX + event.pageY,
        data: {
          x: event.pageX,
          y: event.pageY,
          message: this.message,
          tempUser: this.message.creator,
          element: event.target,
        },
      });
    },
    elementClosestInArray(element: HTMLElement, targets: string[]) {
      for (let index = 0; index < targets.length; index++) {
        const allowClass = targets[index];
        const closestElement = element.closest(allowClass);
        if (closestElement) {
          return closestElement;
        }
      }
      return false;
    },
    userContext(event: MouseEvent) {
      PopoutsModule.ShowPopout({
        id: "context",
        component: "UserContextMenu",
        key: this.message.creator.id + event.clientX + event.clientY,
        data: {
          x: event.clientX,
          y: event.clientY,
          tempUser: this.message.creator,
          id: this.message.creator.id,
        },
      });
    },
  },
});
</script>

<style lang="scss" scoped>
.embed-animation-enter-active,
.embed-animation-leave-active {
  transition: 0.5s;
  transition-delay: 0.1s;
}
.embed-animation-enter-from,
.embed-animation-leave-to {
  transform: translateY(-30px);
  opacity: 0;
}

.avatar {
  align-self: flex-start;
}
.message-container {
  flex-shrink: 0;
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
.disableCheckmark {
  opacity: 0.1;
  cursor: not-allowed;
}
.container {
  overflow: hidden;
  display: flex;
}
.bubble-wrapper {
  overflow: hidden;
  display: flex;
}
.blocked {
  padding: 10px;
  align-items: center;
  justify-content: center;
  align-content: center;
  text-align: center;
  opacity: 0.6;
  transition: 0.2s;
  cursor: pointer;
  &:hover {
    opacity: 1;
  }
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
  width: 46px;
  opacity: 0;
  font-size: 14px;
  align-self: center;
  text-align: center;
  font-size: 12px;
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
