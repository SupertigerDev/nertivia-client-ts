<template>
  <ContextMenu
    ref="context"
    :items="items"
    :pos="pos"
    :element="data.element"
    @close="close"
    @itemClick="itemClick"
    @itemHover="itemHover"
  />
</template>

<script lang="ts">
import ContextMenu from "@/components/ContextMenu.vue";
import Message from "@/interfaces/Message";
import { MeModule } from "@/store/modules/me";
import { ServerMembersModule } from "@/store/modules/serverMembers";
import { permissions } from "@/constants/rolePermissions";
import { ServersModule } from "@/store/modules/servers";
import { PopoutsModule } from "@/store/modules/popouts";
import User from "@/interfaces/User";
import { MessageInputModule } from "@/store/modules/messageInput";
import { insert } from "text-field-edit";
import { PropType } from "vue";
import { defineComponent } from "vue";
import { toClipboard } from "@soerenmartius/vue3-clipboard";
import { MessagesModule } from "@/store/modules/messages";
export default defineComponent({
  name: "MessageContextMenu",
  components: { ContextMenu },
  props: {
    data: {
      type: Object as PropType<{
        x?: number;
        y?: number;
        tempUser: User;
        message: Message & { grouped: boolean };
        element?: HTMLElement;
      }>,
      required: true,
    },
  },
  computed: {
    items(): any {
      const items: any = [
        {
          id: "user",
          name: this.$t("generic.user"),
          icon: "account_box",
          nestContext: true,
        },
        {
          id: "quote",
          name: this.$t("message-context.quote"),
          icon: "format_quote",
        },
      ];
      if (this.message.type === 0) {
        items.push({
          id: "copy",
          name: "Copy Message",
          icon: "developer_board",
        });
      }
      if (this.messageCreatedByMe && this.message.type === 0) {
        items.push({
          id: "edit",
          name: this.$t("message-context.edit"),
          icon: "edit",
        });
      }
      if (this.canDeleteMessage) {
        items.push(
          { type: "seperator" },
          {
            id: "delete",
            name: this.$t("generic.delete"),
            icon: "delete",
            warn: true,
          }
        );
        items.push({
          id: "select",
          name: this.$t("generic.select"),
          icon: "check_box",
        });
      }
      items.push(
        { type: "seperator" },
        {
          id: "copy_id",
          name: this.$t("copy-id-button"),
          icon: "developer_board",
        }
      );

      return items;
    },
    messageCreatedByMe(): any {
      return MeModule.user.id === this.message.creator.id;
    },
    isServerOwner(): any {
      if (!this.serverID) return false;
      const server = ServersModule.servers[this.serverID];
      return MeModule.user.id === server.creator.id;
    },
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
    serverID(): any {
      if (this.currentTab !== "servers") return undefined;
      return this.$route.params.server_id;
    },
    currentTab(): any {
      return this.$route.path.split("/")[2];
    },
    pos(): any {
      return {
        x: this.data.x,
        y: this.data.y,
      };
    },
    message(): any {
      return this.data.message;
    },
  },
  beforeUnmount() {
    PopoutsModule.ClosePopout("hover-context");
  },
  methods: {
    close() {
      PopoutsModule.ClosePopout("context");
    },
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
        case "select": {
          MessagesModule.selectMessage(this.message.messageID);
          break;
        }
        case "delete":
          if (!this.message.messageID) return;
          PopoutsModule.ShowPopout({
            component: "delete-message-popout",
            data: {
              messageID: this.message.messageID,
              channelId: this.message.channelId,
            },
            id: "delete-message",
          });
          break;
        case "edit":
          MessageInputModule.SetEditingMessage(this.message);
          break;
        case "copy_id":
          if (this.message.messageID) {
            toClipboard(this.message.messageID);
          }
          break;
        default:
          break;
      }
    },
    itemHover(data: any) {
      if (data.item.id === "user") {
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
            closeOnMouseLeave: true,
          },
        });
      } else {
        PopoutsModule.ClosePopout("hover-context");
      }
    },
    copyMessage() {
      if (!this.message.message) return;
      toClipboard(this.message.message);
    },
  },
});
</script>

<style scoped></style>
