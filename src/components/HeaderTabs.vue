<template>
  <Draggable
    class="tabs header-tabs"
    :animation="200"
    :delay="$isMobile ? 400 : 0"
    ghost-class="ghost"
    direction="horizontal"
    ref="scroller"
    v-model="tabs"
    item-key="name"
  >
    <template #item="{ element, index }">
      <Tab :tab="element" :selected="currentTabIndex === index" />
    </template>
  </Draggable>
</template>

<script lang="ts">
import Tab from "./HeaderTabTemplate.vue";
import { TabsModule } from "@/store/modules/tabs";
import Draggable from "vuedraggable";

import { defineComponent } from "vue";
export default defineComponent({
  name: "HeaderTabs",
  components: { Tab, Draggable },
  mounted() {
    setTimeout(() => {
      this.scrollToTab();
    }, 1000);
  },
  methods: {
    scrollToTab() {
      const scroller = (this.$refs.scroller as any)?.$el as HTMLElement;
      if (!scroller) return;
      const index = this.currentTabIndex;
      if (index < 0) return;
      this.$nextTick(() => {
        scroller.children[index].scrollIntoView();
      })
    },
  },
  watch: {
    currentTabIndex: {
      immediate: true,
      handler() {
        this.scrollToTab();
      },
    },
  },
  computed: {
    tabs: {
      get(): any {
        return TabsModule.tabs;
      },
      set(tabs: any) {
        TabsModule.updateTabs(tabs);
      },
    },
    currentTabIndex(): number {
      return this.tabs.findIndex((tab) => tab.path === this.$route.path);
    },
  },
});
</script>

<style lang="scss" scoped>
.ghost {
  opacity: 0;
}
.tabs {
  display: flex;
  gap: 5px;
  overflow: overlay;
  height: 100%;
  padding-left: 5px;
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.6);
  }
  &::-webkit-scrollbar {
    width: 3px;
    height: 3px;
  }
}
</style>
