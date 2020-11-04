<template>
  <ContextMenu :items="items" :pos="pos" @itemClick="itemClick" />
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import ContextMenu from "@/components/ContextMenu.vue";
import { PopoutsModule } from "@/store/modules/popouts";

@Component({ components: { ContextMenu } })
export default class extends Vue {
  @Prop() private data!: {
    x?: number;
    y?: number;
    uniqueID: string;
  };
  itemClick(item: any) {
    if (item.name === "View Profile") {
      PopoutsModule.ShowPopout({
        id: "profile",
        component: "profile-popout",
        data: { uniqueID: this.data.uniqueID }
      });
    }
  }

  get items() {
    const items: any = [
      {
        name: "View Profile",
        icon: "person"
      },
      { type: "seperator" },
      {
        name: "Copy User:Tag",
        icon: "developer_board"
      },
      {
        name: "Copy ID",
        icon: "developer_board"
      }
    ];

    return items;
  }
  get pos() {
    return {
      x: this.data.x,
      y: this.data.y
    };
  }
}
</script>

<style scoped></style>
