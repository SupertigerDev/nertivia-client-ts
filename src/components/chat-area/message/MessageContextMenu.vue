<template>
  <ContextMenu :items="items" :pos="pos" @close="$emit('close')" />
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import ContextMenu from "@/components/ContextMenu.vue";
import Message from "@/interfaces/Message";

@Component({ components: { ContextMenu } })
export default class extends Vue {
  @Prop() private message!: Message & { grouped: boolean };
  @Prop() private pos!: { x?: number; y?: number };
  get items() {
    return [
      {
        name: "Copy",
        icon: "developer_board"
      },
      {
        name: "Edit",
        icon: "edit"
      },
      { type: "seperator" },
      {
        name: "Delete",
        icon: "delete"
      }
    ];
  }
}
</script>

<style scoped></style>
