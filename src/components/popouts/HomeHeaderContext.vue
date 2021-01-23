<template>
  <ContextMenu
    ref="context"
    :items="items"
    :pos="pos"
    @itemClick="itemClick"
    @close="close"
  />
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import ContextMenu from "@/components/ContextMenu.vue";
import { PopoutsModule } from "@/store/modules/popouts";
import { logout } from "@/services/userService";

@Component({ components: { ContextMenu } })
export default class extends Vue {
  @Prop() private data!: {
    x: number;
    y: number;
  };

  close() {
    PopoutsModule.ClosePopout("context");
  }

  itemClick(item: any) {
    switch (item.name) {
      case "Open App":
        location.href = "/app";
        break;
      case "Log Out":
        logout().finally(() => {
          delete localStorage["hauthid"];
          location.reload();
        });
        break;
      default:
        break;
    }
  }

  get items() {
    return [
      {
        name: "Open App",
        icon: "open_in_browser"
      },
      { type: "seperator" },
      {
        name: "Log Out",
        warn: true,
        icon: " exit_to_app"
      }
    ];
  }
  get pos() {
    return {
      x: this.data?.x,
      y: this.data?.y
    };
  }
}
</script>

<style scoped></style>
