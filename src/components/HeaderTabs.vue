<template>
  <Draggable
    class="tabs header-tabs"
    :animation="200"
    :delay="$isMobile ? 400 : 0"
    ghost-class="ghost"
    direction="horizontal"
    v-model="tabs"
  >
    <Tab
      v-for="(tab, i) in tabs"
      :key="i"
      :tab="tab"
      :selected="currentTabIndex === i"
    />
  </Draggable>
</template>

<script lang="ts">
import Tab from "./HeaderTabTemplate.vue";
import { TabsModule } from "@/store/modules/tabs";
import Draggable from "vuedraggable";
import Vue from "vue";
import { defineComponent } from "vue";
export default defineComponent({
  name: "HeaderTabs",
  components: { Tab, Draggable },
  computed: {
    tabs: {
      get(): any {
        return TabsModule.tabs;
      },
      set(tabs: any) {
        TabsModule.updateTabs(tabs);
      }
    },
    currentTabIndex(): number {
      return this.tabs.findIndex(tab => tab.path === this.$route.path);
    }
  }
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
.tab {
  display: flex;
  align-items: center;
  padding: 5px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 4px;
  flex-shrink: 0;
  align-self: center;
  cursor: pointer;
  max-width: 200px;
  .title {
    color: rgba(255, 255, 255, 0.6);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .material-icons {
    font-size: 14px;
    margin-left: 3px;
    padding: 5px;
    opacity: 0;
    border-radius: 4px;
    &:hover {
      background: rgba(255, 255, 255, 0.3);
    }
  }
  &:hover {
    .material-icons {
      opacity: 1;
    }
  }
  &.selected {
    .title {
      color: white;
    }
    .material-icons {
      opacity: 1;
    }
  }
}
</style>
