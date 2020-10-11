<template>
  <ContextMenu :items="items" :pos="pos" @close="$emit('close')" />
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import ContextMenu from "@/components/ContextMenu.vue";
import Message from "@/interfaces/Message";
import { MeModule } from "@/store/modules/me";

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
  get canDeleteMessage() {
    if (this.messageCreatedByMe) return true;
    return false;
  }
}
</script>

<style scoped></style>
