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
import { Tab, TabsModule } from "@/store/modules/tabs";

import { PropType } from "vue";
import { defineComponent } from "vue";
export default defineComponent({
  name: "ServerContextMenu",
  components: { ContextMenu },
  props: {
    data: {
      type: Object as PropType<{
        x: number;
        y: number;
        tab: Tab;
      }>,
      required: true,
    },
  },
  computed: {
    items() {
      return [
        {
          id: "close",
          name: "Close",
          icon: "close",
        },
        {
          id: "close_other_tab",
          name: "Close other tabs",
          icon: "clear_all",
        },
        {
          id: "close_right_tabs",
          name: "Close tabs to the right",
          icon: "navigate_next",
        },
      ];
    },
    pos(): any {
      return {
        x: this.data.x,
        y: this.data.y,
      };
    },
  },
  methods: {
    close() {
      PopoutsModule.ClosePopout("context");
    },
    itemClick(item: any) {
      switch (item.id) {
        case "close": {
          if (!this.data.tab.path) return;
          TabsModule.closeTabByPath(this.data.tab.path);
          break;
        }
        case "close_other_tab": {
          TabsModule.setCurrentTab(this.data.tab);
          [...TabsModule.tabs].forEach((tab, index) => {
            setTimeout(() => {
              if (tab === this.data.tab) {
                return;
              }
              if (!tab.path) return;
              TabsModule.closeTabByPath(tab.path);
            }, index * 100);
          });
          break;
        }
        case "close_right_tabs": {
          let foundCurrentTab = false;
          [...TabsModule.tabs].forEach((tab, index) => {
            if (tab === this.data.tab) {
              foundCurrentTab = true;
              return;
            }
            if (!foundCurrentTab) return;
            setTimeout(() => {
              if (!tab.path) return;
              TabsModule.closeTabByPath(tab.path);
            }, index * 100);
          });
          break;
        }
        default:
          break;
      }
    },
  },
});
</script>

<style scoped></style>
