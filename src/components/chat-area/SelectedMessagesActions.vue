<template>
  <div class="selected-message-actions" v-if="selectedMessages.length">
    <CustomButton
      class="button"
      name="Select All"
      icon="check_box"
      @click="selectAll"
    />
    <CustomButton
      class="button"
      :name="`Delete Selected (${selectedMessages.length})`"
      icon="delete"
      alert
      @click="onDeleteClicked"
    />
    <CustomButton
      class="button close-button"
      icon="close"
      @click="deselectAll"
      alert
    />
  </div>
</template>

<script lang="ts">
import { permissions } from "@/constants/rolePermissions";
import Message from "@/interfaces/Message";
import { MeModule } from "@/store/modules/me";
import { MessagesModule } from "@/store/modules/messages";
import { PopoutsModule } from "@/store/modules/popouts";
import { ServerMembersModule } from "@/store/modules/serverMembers";
import { ServersModule } from "@/store/modules/servers";
import { defineComponent } from "vue";
import CustomButton from "../CustomButton.vue";
export default defineComponent({
  components: { CustomButton },
  data() {
    return {
      //
    };
  },
  methods: {
    onDeleteClicked() {
      if (this.selectedMessages.length === 1) {
        PopoutsModule.ShowPopout({
          id: "delete-message",
          component: "delete-message-popout",
          data: {
            messageID: this.selectedMessages[0],
            channelId: this.channelId,
            callback: this.onDeleted,
          },
        });
        return;
      }
      PopoutsModule.ShowPopout({
        id: "delete-message-batch",
        component: "delete-message-batch-popout",
      });
    },
    onDeleted() {
      this.deselectAll();
    },
    selectAll() {
      MessagesModule.messages[this.channelId].forEach((m) => {
        if (!m.messageID) return;
        if (!this.canDeleteMessage(m)) return;
        MessagesModule.selectMessage(m.messageID);
      });
    },
    deselectAll() {
      MessagesModule.deselectAll();
    },
  },
  computed: {
    selectedMessages() {
      return MessagesModule.selectedMessageIds;
    },
    canDeleteMessage(): any {
      return (message: Message) => {
        if (!message.messageID) return false;
        if (message.localMessage) return false;
        if (this.messageCreatedByMe(message)) return true;
        if (!this.serverID) return false;
        if (this.isServerOwner) return true;
        if (!MeModule.user.id) return false;
        return ServerMembersModule.memberHasPermission(
          MeModule.user.id,
          this.serverID,
          permissions.ADMIN.value
        );
      };
    },
    messageCreatedByMe(): any {
      return (message: Message) => MeModule.user.id === message.creator.id;
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
    channelId(): string {
      return this.$route.params.channel_id as string;
    },
  },
});
</script>

<style lang="scss" scoped>
.selected-message-actions {
  display: flex;
  align-items: center;
  background: var(--typing-status-bg-color);
  z-index: 999999999;
  overflow: hidden;
}
.selected-count {
  margin: 5px;
  opacity: 0.6;
  text-align: center;
}
.button {
  padding: 5px;
  height: 40px;
  &.close-button {
    margin-left: auto;
    width: 40px;
  }
}

.animate-container {
  display: flex;
  align-items: center;
  opacity: 0;
  animation: showUp 0.2s;
  overflow: hidden;
  animation-fill-mode: forwards;
}
@keyframes showUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@media (max-width: 1147px) {
  // .selected-message-actions {
  //   flex-direction: column;
  //   flex-shrink: 0;
  //   align-items: stretch;
  // }
  // .selected-count {
  //   margin-top: 10px;
  // }
}
</style>

<style lang="scss"></style>
