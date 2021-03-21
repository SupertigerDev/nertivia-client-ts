<template>
  <div class="settings-drawer">
    <div class="items">
      <div
        class="item"
        v-for="(page, path) in pages"
        :key="path"
        :class="{ selected: path === currentSettingTab }"
        @click="changeTab(path)"
      >
        <div class="material-icons">{{ page.icon }}</div>
        <div class="name">{{ page.name }}</div>
      </div>
    </div>
    <div class="item" @click="showChangelog">
      <div class="material-icons">description</div>
      <div class="name">Changelog</div>
      <div class="version">{{ $version }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import settingPages from "@/utils/settingPages.json";
import { PopoutsModule } from "@/store/modules/popouts";
import { DrawersModule } from "@/store/modules/drawers";

@Component
export default class MainApp extends Vue {
  pages = settingPages;
  get currentSettingTab() {
    return this.$route.params.tab;
  }
  changeTab(path: string) {
    DrawersModule.SetLeftDrawer(false);

    this.$router.push({ params: { tab: path } });
  }
  showChangelog() {
    PopoutsModule.ShowPopout({
      id: "changelog-popout",
      component: "ChangelogPopout",
      data: {}
    });
  }
}
</script>
<style lang="scss" scoped>
.settings-drawer {
  overflow: hidden;
  display: flex;
  height: 100%;
  flex-direction: column;
}
.items {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: auto;
}
.item {
  display: flex;
  align-items: center;
  align-content: center;
  height: 30px;
  margin: 4px;
  padding-left: 4px;
  flex-shrink: 0;
  cursor: pointer;
  user-select: none;
  color: white;
  position: relative;
  opacity: 0.8;
  border-radius: 4px;
  transition: 0.2s;
  overflow: hidden;
  .name {
    margin-left: 4px;
  }
  .version {
    opacity: 0.6;
    font-size: 14px;
    margin-left: auto;
    margin-right: 5px;
  }
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    opacity: 1;
  }
  &.selected {
    background: rgba(255, 255, 255, 0.1);
    &:before {
      content: "";
      position: absolute;
      background: var(--primary-color);
      left: 0;
      top: 0;
      width: 3px;
      bottom: 0;
    }
    opacity: 1;
  }
}
@media (max-width: 950px) {
  .settings-drawer {
    padding-bottom: 56px;
  }
}
</style>
