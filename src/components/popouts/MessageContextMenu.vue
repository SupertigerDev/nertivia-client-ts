<template>
  <ContextMenu
    ref="context"
    :items="items"
    :pos="pos"
    @close="close"
    @itemClick="itemClick"
    @itemHover="itemHover"
  />
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import ContextMenu from "@/components/ContextMenu.vue";
import Message from "@/interfaces/Message";
import { MeModule } from "@/store/modules/me";
import { ServerMembersModule } from "@/store/modules/serverMembers";
import { permissions } from "@/constants/rolePermissions";
import { ServersModule } from "@/store/modules/servers";
import { PopoutsModule } from "@/store/modules/popouts";
import User from "@/interfaces/User";
import { eventBus } from "@/utils/globalBus";
import { MessageInputModule } from "@/store/modules/messageInput";
import { insert } from "text-field-edit";

@Component({ components: { ContextMenu } })
export default class extends Vue {
  lastItemHover = null;
  @Prop() private data!: {
    x?: number;
    y?: number;
    tempUser: User;
    message: Message & { grouped: boolean };
  };
  close() {
    PopoutsModule.ClosePopout("context");
  }
  beforeDestroy() {
    PopoutsModule.ClosePopout("hover-context");
  }
  itemClick(item: { id: string }) {
    switch (item.id) {
      case "copy":
        this.copyMessage();
        break;
      case "quote": {
        const messageBox: any = document.getElementById("message-box");
        messageBox && insert(messageBox, `<m${this.message.messageID}>`);
        messageBox.focus();
        break;
      }
      case "delete":
        if (!this.message.messageID) return;
        PopoutsModule.ShowPopout({
          component: "delete-message-popout",
          data: {
            messageID: this.message.messageID,
            channelID: this.message.channelID
          },
          id: "delete-message"
        });
        break;
      case "edit":
        MessageInputModule.SetEditingMessage(this.message);
        break;
      case "copy_id":
        if (this.message.messageID) this.$copyText(this.message.messageID);
        break;
      default:
        break;
    }
  }
  itemHover(data: any) {
    if (data.item.name === "User") {
      const rect = data.target.getBoundingClientRect();
      PopoutsModule.ShowPopout({
        id: "hover-context",
        component: "UserContextMenu",
        key: this.message.creator.id + rect.x + rect.y,
        data: {
          x: rect.x + this.$el.clientWidth + 3,
          y: rect.y,
          parentContextWidth: (this.$refs.context as any).width,
          tempUser: this.data.tempUser,
          id: this.message.creator.id,
          closeOnMouseLeave: true
        }
      });
    } else {
      PopoutsModule.ClosePopout("hover-context");
    }
  }
  copyMessage() {
    if (!this.message.message) return;
    this.$copyText(this.message.message);
  }
  get items() {
    const items: any = [
      {
        id: "user",
        name: this.$t("message-context.user"),
        icon: "account_box",
        nestContext: true
      },
      {
        id: "quote",
        name: this.$t("message-context.quote"),
        icon: "format_quote"
      }
    ];
    if (this.message.type === 0) {
      items.push({
        id: "copy",
        name: this.$t("message-context.copy"),
        icon: "developer_board"
      });
    }
    if (this.messageCreatedByMe && this.message.type === 0) {
      items.push({
        id: "edit",
        name: this.$t("message-context.edit"),
        icon: "edit"
      });
    }
    if (this.canDeleteMessage) {
      items.push(
        { type: "seperator" },
        {
          id: "delete",
          name: this.$t("message-context.delete"),
          icon: "delete",
          warn: true
        }
      );
    }
    items.push(
      { type: "seperator" },
      {
        id: "copy_id",
        name: this.$t("copy-id-button"),
        icon: "developer_board"
      }
    );

    return items;
  }
  get messageCreatedByMe() {
    return MeModule.user.id === this.message.creator.id;
  }
  // if the logged in user is the server owner
  get isServerOwner() {
    if (!this.serverID) return false;
    const server = ServersModule.servers[this.serverID];
    return MeModule.user.id === server.creator.id;
  }
  get canDeleteMessage() {
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
  }
  get serverID() {
    if (this.currentTab !== "servers") return undefined;
    return this.$route.params.server_id;
  }
  get currentTab() {
    return this.$route.path.split("/")[2];
  }
  get pos() {
    return {
      x: this.data.x,
      y: this.data.y
    };
  }
  get message() {
    return this.data.message;
  }
}
</script>

<style scoped></style>
