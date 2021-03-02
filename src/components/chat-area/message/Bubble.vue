<template>
  <div
    class="bubble"
    :class="{ me: isMessageCreatedByMe, grouped: message.grouped }"
  >
    <div class="bubble-inner">
      <div class="details" v-if="!message.grouped">
        <div
          class="username"
          @contextmenu.prevent="userContext"
          @click="showProfile"
          :style="{ color: roleColor }"
          v-text="creator.username"
        />
        <div class="badge bot" v-if="creator.bot">BOT</div>
        <div class="date">{{ date }}</div>
      </div>
      <div class="image-embed" v-if="isFileImage">
        <ImageMessageEmbed :message="message" />
        <!-- This is done like this to make the message bubble not look ugly when the message is larger than the image. -->
        <div class="message" v-if="message.message">
          <Markup :text="message.message" :message="message" />
        </div>
      </div>
      <FileMessage v-else-if="file" :message="message" />
      <div class="message" v-if="message.message && !isFileImage">
        <Markup :text="message.message" :message="message" />
      </div>
      <InviteMessage v-if="invite" :invite="invite" :message="message" />
    </div>
  </div>
</template>

<script lang="ts">
import Message from "@/interfaces/Message";
import ImageMessageEmbed from "./ImageMessageEmbed.vue";
import FileMessage from "./FileMessage.vue";
import InviteMessage from "./InviteMessage.vue";
import { MeModule } from "@/store/modules/me";
import { Component, Prop, Vue } from "vue-property-decorator";
import friendlyDate from "@/utils/date";
import { ServerMembersModule } from "@/store/modules/serverMembers";
import { PopoutsModule } from "@/store/modules/popouts";
import Markup from "@/components/Markup.vue";
import Invite from "@/interfaces/Invite";

@Component({
  components: {
    ImageMessageEmbed,
    FileMessage,
    InviteMessage,
    Markup
  }
})
export default class Bubble extends Vue {
  loadRoleColor = false;
  @Prop() private message!: Message & { grouped: boolean };
  @Prop() private invite!: Invite;

  showProfile() {
    PopoutsModule.ShowPopout({
      id: "profile",
      component: "profile-popout",
      data: { uniqueID: this.creator.uniqueID }
    });
  }

  mounted() {
    setTimeout(() => {
      this.loadRoleColor = true;
    }, 10);
  }

  userContext(event: MouseEvent) {
    PopoutsModule.ShowPopout({
      id: "context",
      component: "UserContextMenu",
      key: this.message.creator.uniqueID + event.clientX + event.clientY,
      data: {
        tempUser: this.message.creator,
        x: event.clientX,
        y: event.clientY,
        uniqueID: this.message.creator.uniqueID
      }
    });
  }

  get creator() {
    return this.message.creator;
  }
  get isMessageCreatedByMe() {
    return this.message.creator.uniqueID === MeModule.user.uniqueID;
  }

  // Embeds
  get isFileImage() {
    if (!this.file) return false;
    if (!this.file.dimensions) return false;
    return true;
  }
  get isVideo() {
    if (!this.file) return false;
    return this.file.fileName?.endsWith(".mp4");
  }
  get file() {
    const files = this.message.files;
    if (!files || !files.length) return undefined;
    return files[0];
  }
  get date() {
    return friendlyDate(this.message.created);
  }
  get roleColor() {
    if (!this.loadRoleColor) return undefined;
    if (!this.server_id) return undefined;
    const role = ServerMembersModule.firstMemberRole(
      this.server_id,
      this.creator.uniqueID
    );
    return role?.color;
  }
  get server_id() {
    return this.$route.params.server_id;
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
  padding: 7px;

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
.bubble-inner {
  overflow: hidden;
}

.message {
  color: #e0e0e0;
}
.image-embed .message {
  margin-top: 4px;
}
.image-embed {
  display: table-caption;
}

.details {
  display: flex;
  align-items: center;
  align-content: center;
  margin-bottom: 3px;
  .username {
    cursor: pointer;
    font-weight: bold;
    font-size: 14px;
    &:hover {
      text-decoration: underline;
    }
  }
  .date {
    opacity: 0.6;
    font-size: 12px;
    margin-left: 5px;
  }
}
.badge {
  background: red;
  font-size: 12px;
  padding: 3px;
  border-radius: 4px;
  margin-left: 5px;
  &.bot {
    background: rgb(92, 81, 255);
  }
}
</style>
