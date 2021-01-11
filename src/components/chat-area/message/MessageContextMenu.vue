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

@Component({ components: { ContextMenu } })
export default class extends Vue {
  lastItemHover = null;
  @Prop() private data!: {
    x?: number;
    y?: number;
    tempUser: User;
    message: Message & { grouped: boolean };
  };
  $isMobile: boolean | undefined;
  close() {
    PopoutsModule.ClosePopout("context");
  }
  beforeDestroy() {
    PopoutsModule.ClosePopout("hover-context");
  }
  itemClick(item: { name: string }) {
    switch (item.name) {
      case "User":
        if (this.$isMobile) return;
        PopoutsModule.ShowPopout({
          id: "profile",
          component: "profile-popout",
          data: { uniqueID: this.message.creator.uniqueID }
        });
        break;
      case "Copy":
        this.copyMessage();
        break;
      case "Delete":
        PopoutsModule.ShowPopout({
          component: "delete-message-popout",
          data: {
            messageID: this.message.messageID,
            channelID: this.message.channelID
          },
          id: "delete-message"
        });
        break;
      case "Edit":
        eventBus.$emit("editMessage", this.message.messageID);
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
        key: this.message.creator.uniqueID + rect.x + rect.y,
        data: {
          x: rect.x + this.$el.clientWidth + 3,
          y: rect.y,
          parentContextWidth: (this.$refs.context as any).width,
          tempUser: this.data.tempUser,
          uniqueID: this.message.creator.uniqueID,
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
        name: "User",
        icon: "account_box",
        nestContext: true
      }
    ];
    if (this.message.type === 0) {
      items.push({
        name: "Copy",
        icon: "developer_board"
      });
    }
    if (this.messageCreatedByMe && this.message.type === 0) {
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
          icon: "delete",
          warn: true
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
