<template>
  <ContextMenu ref="context" :items="items" :pos="pos" @itemClick="itemClick" />
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import ContextMenu from "@/components/ContextMenu.vue";
import { PopoutsModule } from "@/store/modules/popouts";
import WindowProperties from "@/utils/windowProperties";

@Component({ components: { ContextMenu } })
export default class extends Vue {
  x = 0;
  @Prop() private data!: {
    x?: number;
    y?: number;
    uniqueID: string;
    parentContextWidth?: number;
  };

  mounted() {
    // move to right if cant fit with parent context.
    if (this.data.parentContextWidth) {
      if (!this.data.x) return;
      const thisWidth = this.$refs.context.width;
      // console.log(thisWidth);
      const rightPos = this.data.x + thisWidth;
      if (rightPos > WindowProperties.resizeWidth) {
        this.x = this.data.x - (thisWidth + this.data.parentContextWidth + 5);
      } else {
        this.x = this.data.x;
      }
    }
  }
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
      x: this.x,
      y: this.data.y
    };
  }
}
</script>

<style scoped></style>
