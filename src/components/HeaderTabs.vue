<template>
  <div class="tabs header-tabs">
    <Tab
      v-for="(tab, i) in tabs"
      :key="i"
      :tab="tab"
      :selected="currentTabIndex === i"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Tab from "./HeaderTabTemplate.vue";
import { TabsModule } from "@/store/modules/tabs";
@Component({ components: { Tab } })
export default class HeaderTabs extends Vue {
  get tabs() {
    return TabsModule.tabs;
  }
  get currentTabIndex() {
    return this.tabs.findIndex(tab => tab.path === this.$route.path);
  }
}
</script>

<style lang="scss" scoped>
.tabs {
  display: flex;
  gap: 5px;
  overflow: hidden;
  height: 100%;
  padding-left: 5px;
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.6);
  }
  &::-webkit-scrollbar {
    width: 3px;
    height: 3px;
  }
  &:hover {
    overflow: overlay;
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
