<template>
  <ContextMenu :items="items" :pos="pos" @close="$emit('close')" />
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import ContextMenu from "@/components/ContextMenu.vue";
import Message from "@/interfaces/Message";
import { MeModule } from "@/store/modules/me";
import { ServerMembersModule } from "@/store/modules/serverMembers";
import perms from "@/constants/rolePermissions";
import { ServersModule } from "@/store/modules/servers";

@Component({ components: { ContextMenu } })
export default class extends Vue {
  @Prop() private message!: Message & { grouped: boolean };
  @Prop() private pos!: { x?: number; y?: number };
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
}
</script>

<style scoped></style>
