<template>
  <div class="message actionMessage">
    <AvatarImage
      class="avatar"
      :imageId="message.creator.avatar"
      :seedId="message.creator.id"
      :animateGif="false"
      :willHaveClickEvent="true"
      size="40px"
      @click="showProfile"
      @contextmenu.prevent="showUserContext"
    />
    <div class="details">
      <div class="message">
        <span
          class="username"
          @click="showProfile"
          :style="{ color: roleColor }"
          @contextmenu.prevent="showUserContext"
          >{{ message.creator.username }}</span
        >
        <span class="msg" :style="{ color: type.color }"
          >&nbsp;{{ type.message }}</span
        >
      </div>
      <div class="time">{{ time }}</div>
    </div>
    <MessageSide :message="message" v-if="!hideContext" />
  </div>
</template>
<script lang="ts">
import Message from "@/interfaces/Message";
import AvatarImage from "@/components/AvatarImage.vue";
import friendlyTime from "@/utils/date";
import { PopoutsModule } from "@/store/modules/popouts";
import MessageSide from "./MessageSide.vue";
import { ServerMembersModule } from "@/store/modules/serverMembers";
import i18n from "@/i18n";
import Vue, { PropType } from "vue";

const types = [
  {},
  { color: "#29bf12", message: i18n.global.t("messages.joined") },
  { color: "#968b8b", message: i18n.global.t("messages.left") },
  { color: "#ff9914", message: i18n.global.t("messages.kicked") },
  { color: "#d92121", message: i18n.global.t("messages.banned") }
];
import { defineComponent } from "vue";
export default defineComponent({
  name: "ActionMessageTemplate",
  components: { AvatarImage, MessageSide },
  props: {
    message: {
      type: Object as PropType<Message & { grouped: boolean }>,
      required: true
    },
    hideContext: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loadRoleColor: false
    };
  },
  computed: {
    roleColor(): any {
      if (!this.loadRoleColor) return undefined;
      if (!this.server_id) return undefined;
      const role = ServerMembersModule.firstMemberRole(
        this.server_id,
        this.creator.id
      );
      return role?.color;
    },
    server_id(): any {
      return this.$route.params.server_id;
    },
    creator(): any {
      return this.message.creator;
    },
    type(): any {
      return types[this.message.type || 0];
    },
    time(): any {
      return friendlyTime(this.message.created, localStorage["timeFormat"]);
    }
  },
  mounted() {
    window.setTimeout(() => {
      this.loadRoleColor = true;
    }, 10);
  },
  methods: {
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
    },
    showProfile() {
      PopoutsModule.ShowPopout({
        id: "profile",
        component: "profile-popout",
        data: { id: this.message.creator.id }
      });
    }
  }
});
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
