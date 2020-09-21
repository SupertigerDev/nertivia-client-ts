<template>
  <div class="dm-drawer">
    <div class="tabs">
      <div
        class="tab"
        @click="changeTab(0)"
        :class="{ selected: selectedTab === 0 }"
      >
        <div class="material-icons">group</div>
        Friends
      </div>
      <div
        class="tab"
        @click="changeTab(1)"
        :class="{ selected: selectedTab === 1 }"
      >
        <div class="material-icons">access_time</div>
        Recents
      </div>
    </div>
    <FriendList v-if="selectedTab === 0" />
  </div>
</template>

<script lang="ts">
const FriendList = () =>
  import(
    /* webpackChunkName: "FriendList" */ "@/components/drawers/direct-message-drawer/FriendList.vue"
  );

import { Component, Vue } from "vue-property-decorator";

@Component({ components: { FriendList } })
export default class MainApp extends Vue {
  selectedTab = parseInt(localStorage.getItem("selectedDmTab") || "0");

  changeTab(index: number) {
    this.selectedTab = index;
    localStorage.setItem("selectedDmTab", index.toString());
  }
}
</script>

<style lang="scss" scoped>
.dm-drawer {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.tabs {
  display: flex;
  width: 100%;
}
.tab {
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  height: 30px;
  flex: 1;
  user-select: none;
  cursor: pointer;
  transition: 0.2s;
  opacity: 0.7;
  border-radius: 4px;
  margin: 2px;
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    opacity: 1;
  }
  &.selected {
    background: var(--primary-color);
    opacity: 1;
  }
  .material-icons {
    margin-right: 5px;
  }
}
</style>
