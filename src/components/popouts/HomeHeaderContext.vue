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
import ContextMenu from "@/components/ContextMenu.vue";
import { PopoutsModule } from "@/store/modules/popouts";
import { logout } from "@/services/userService";
import { PropType } from "vue";
import { defineComponent } from "vue";
export default defineComponent({
  name: "HomeHeaderContext",
  components: { ContextMenu },
  props: {
    data: {
      type: Object as PropType<{
        x: number;
        y: number;
      }>,
      required: true,
    },
  },
  computed: {
    items(): any {
      return [
        {
          name: "Open App",
          icon: "open_in_browser",
        },
        { type: "seperator" },
        {
          name: "Log Out",
          warn: true,
          icon: " exit_to_app",
        },
      ];
    },
    pos(): any {
      return {
        x: this.data?.x,
        y: this.data?.y,
      };
    },
  },
  methods: {
    close() {
      PopoutsModule.ClosePopout("context");
    },
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
    },
  },
});
</script>

<style scoped></style>
