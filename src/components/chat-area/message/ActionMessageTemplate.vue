<template>
  <div class="actionMessage">
    <AvatarImage
      class="avatar"
      :imageId="message.creator.avatar"
      :seedId="message.creator.id"
      :animateGif="false"
      :willHaveClickEvent="true"
      size="40px"
      @click.native="showProfile"
      @contextmenu.native.prevent="showUserContext"
    />
    <div class="details">
      <div class="message">
        <span
          class="username"
          @click="showProfile"
          :style="{ color: roleColor }"
          @contextmenu.prevent="showUserContext"
          >{{ message.creator.username }}</span
        >&nbsp;
        <span class="msg" :style="{ color: type.color }">{{
          type.message
        }}</span>
      </div>
      <div class="time">{{ time }}</div>
    </div>
    <MessageSide :message="message" v-if="!hideContext" />
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

import Message from "@/interfaces/Message";
import AvatarImage from "@/components/AvatarImage.vue";
import friendlyTime from "@/utils/date";
import { PopoutsModule } from "@/store/modules/popouts";
import MessageSide from "./MessageSide.vue";
import { ServerMembersModule } from "@/store/modules/serverMembers";
import i18n from "@/i18n";

const types = [
  {},
  { color: "#29bf12", message: i18n.t("messages.joined") },
  { color: "#968b8b", message: i18n.t("messages.left") },
  { color: "#ff9914", message: i18n.t("messages.kicked") },
  { color: "#d92121", message: i18n.t("messages.banned") }
];
@Component({ components: { AvatarImage, MessageSide } })
export default class ActionMessageTemplate extends Vue {
  loadRoleColor = false;
  @Prop() private message!: Message & { grouped: boolean };
  @Prop({ default: false }) private hideContext!: boolean;

  mounted() {
    setTimeout(() => {
      this.loadRoleColor = true;
    }, 10);
  }
  showUserContext(event: MouseEvent) {
    PopoutsModule.ShowPopout({
      id: "context",
      component: "UserContextMenu",
      key: this.message.creator.id + event.clientX + event.clientY,
      data: {
        x: event.clientX,
        y: event.clientY,
        id: this.message.creator.id,
        tempUser: this.message.creator
      }
    });
  }
  showProfile() {
    PopoutsModule.ShowPopout({
      id: "profile",
      component: "profile-popout",
      data: { id: this.message.creator.id }
    });
  }

  get roleColor() {
    if (!this.loadRoleColor) return undefined;
    if (!this.server_id) return undefined;
    const role = ServerMembersModule.firstMemberRole(
      this.server_id,
      this.creator.id
    );
    return role?.color;
  }
  get server_id() {
    return this.$route.params.server_id;
  }

  get creator() {
    return this.message.creator;
  }
  get type() {
    return types[this.message.type || 0];
  }
  get time() {
    return friendlyTime(this.message.created);
  }
}
</script>
<style lang="scss" scoped>
.actionMessage {
  display: flex;
  flex-shrink: 0;
  margin: 10px;
}

.avatar {
  margin-right: 10px;
}
.username {
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
}

.time {
  opacity: 0.8;
  font-size: 14px;
  margin-top: 5px;
  text-align: left;
}
</style>
<style lang="scss">
.actionMessage:hover {
  .options-button {
    opacity: 1;
  }
}
</style>
