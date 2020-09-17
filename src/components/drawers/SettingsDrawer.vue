<template>
  <div class="server-drawer">
    <div class="items">
      <div
        class="item"
        v-for="page in pages"
        :key="page.path"
        :class="{ selected: page.path === currentSettingTab }"
        @click="changeTab(page.path)"
      >
        <div class="material-icons">{{ page.icon }}</div>
        <div class="name">{{ page.name }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class MainApp extends Vue {
  pages = [
    {
      name: "Account",
      path: "account",
      icon: "account_circle"
    },
    {
      name: "Interface",
      path: "interface",
      icon: "view_quilt"
    }
  ];
  get currentSettingTab() {
    return this.$route.params.tab;
  }
  changeTab(path: string) {
    this.$router.push({ params: { tab: path } });
  }
}
</script>
<style lang="scss" scoped>
.item {
  display: flex;
  align-items: center;
  align-content: center;
  height: 30px;
  margin: 4px;
  padding-left: 4px;
  cursor: pointer;
  user-select: none;
  opacity: 0.8;
  border-radius: 4px;
  transition: 0.2s;
  .name {
    margin-left: 4px;
  }
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    opacity: 1;
  }
  &.selected {
    background-color: var(--primary-color);
    opacity: 1;
  }
}
</style>
