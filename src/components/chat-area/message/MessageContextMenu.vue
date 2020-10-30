<template>
  <ContextMenu
    :key="message.tempID || message.messageID"
    :items="items"
    :pos="pos"
    @close="close"
    @itemClick="itemClick"
  />
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import ContextMenu from "@/components/ContextMenu.vue";
import Message from "@/interfaces/Message";
import { MeModule } from "@/store/modules/me";
import { ServerMembersModule } from "@/store/modules/serverMembers";
import perms from "@/constants/rolePermissions";
import { ServersModule } from "@/store/modules/servers";
import { deleteMessage } from "@/services/messagesService";
import { PopoutsModule } from "@/store/modules/popouts";

@Component({ components: { ContextMenu } })
export default class extends Vue {
  @Prop() private data!: {
    x?: number;
    y?: number;
    message: Message & { grouped: boolean };
  };
  close() {
    PopoutsModule.ClosePopout("context");
  }
  itemClick(item: { name: string }) {
    switch (item.name) {
      case "Copy":
        this.copyMessage();
        break;
      case "Delete":
        this.deleteMessage();
        break;
      default:
        break;
    }
  }
  copyMessage() {
    if (!this.message.message) return;
    this.$copyText(this.message.message);
  }
  deleteMessage() {
    if (!this.message.messageID) return;
    deleteMessage(this.message.channelID, this.message.messageID);
  }
  get items() {
    const items: any = [
      {
        name: "Copy",
        icon: "developer_board"
      }
    ];
    if (this.messageCreatedByMe) {
      items.push({
        name: "Edit",
        icon: "edit"
      });
    }
    if (this.canDeleteMessage) {
      items.push(
        { type: "seperator" },
        {
          name: "Delete",
          icon: "delete"
        }
      );
    }

    return items;
  }
  get messageCreatedByMe() {
    return MeModule.user.uniqueID === this.message.creator.uniqueID;
  }
  // if the logged in user is the server owner
  get isServerOwner() {
    if (!this.serverID) return false;
    const server = ServersModule.servers[this.serverID];
    return MeModule.user.uniqueID === server.creator.uniqueID;
  }
  get canDeleteMessage() {
    if (this.messageCreatedByMe) return true;
    if (!this.serverID) return false;
    if (this.isServerOwner) return true;
    if (!MeModule.user.uniqueID) return false;
    return ServerMembersModule.memberHasPermission(
      MeModule.user.uniqueID,
      this.serverID,
      perms.ADMIN.value
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
