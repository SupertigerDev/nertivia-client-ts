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
        <div class="name">{{ $t(`settings.tab-names.${path}`) }}</div>
        <div class="alert-circle" v-if="page.alert"></div>
      </div>
    </div>
    <a
      href="https://ko-fi.com/S6S243GRX"
      target="_blank"
      rel="noopener noreferrer"
      class="item donate"
    >
      <div class="container">
        <img src="@/assets/kofi-logo.png" alt="" />
        <div class="name">Support me on Ko-fi</div>
      </div>
      <div class="description">
        Get a badge on your profile to show your support.
      </div>
    </a>
    <div class="item" @click="showMarkupGuide">
      <div class="material-icons">menu_book</div>
      <div class="name">Markup Guide</div>
    </div>
    <a
      href="https://github.com/Nertivia/issues"
      style="text-decoration: none"
      target="_blank"
      rel="noopener noreferrer"
    >
      <div class="item">
        <div class="material-icons">launch</div>
        <div class="name">Report Bugs</div>
      </div>
    </a>
    <div class="item" @click="showChangelog">
      <div class="material-icons">description</div>
      <div class="name">Changelog</div>
      <div class="version">{{ $version }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import settingPages from "@/utils/settingPages.json";
import { PopoutsModule } from "@/store/modules/popouts";
import { DrawersModule } from "@/store/modules/drawers";

interface Pages {
  [key: string]: {
    name: string;
    icon: string;
    component: string;
    alert?: boolean;
  };
}

import { defineComponent } from "vue";
export default defineComponent({
  name: "MainApp",
  data() {
    return {
      pages: settingPages as any as Pages,
    };
  },
  computed: {
    currentSettingTab(): any {
      return this.$route.params.tab;
    },
  },
  methods: {
    changeTab(path: string) {
      DrawersModule.SetLeftDrawer(false);

      this.$router.push({ params: { tab: path } });
    },
    showMarkupGuide() {
      PopoutsModule.ShowPopout({
        id: "markup-guide",
        component: "markup-guide",
      });
    },
    showChangelog() {
      PopoutsModule.ShowPopout({
        id: "changelog-popout",
        component: "ChangelogPopout",
        data: {},
      });
    },
  },
});
</script>
<style lang="scss" scoped>
.settings-drawer {
  overflow: hidden;
  display: flex;
  height: 100%;
  flex-direction: column;
  width: 250px;
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
  &:before {
    content: "";
    position: absolute;
    left: 0;
    top: 6px;
    bottom: 6px;
    width: 4px;
    transition: 0.1s;
    border-radius: 4px;
  }
  .alert-circle {
    height: 7px;
    width: 7px;
    margin-left: auto;
    margin-right: 10px;
    background: var(--alert-color);
    border-radius: 50%;
  }
  .name {
    margin-left: 4px;
  }
  .material-icons {
    margin-left: 5px;
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
    &:before {
      background: var(--primary-color);
      opacity: 0.4;
    }
  }
  &.donate {
    background: var(--alert-color);
    text-decoration: none;
    height: initial;
    flex-direction: column;
    align-items: initial;
    padding-bottom: 5px;
    &:before {
      width: 0;
    }
    img {
      height: 30px;
      width: 30px;
    }
    .container {
      display: flex;
      align-items: center;
    }
    .description {
      font-size: 13px;
      opacity: 0.9;
      margin-left: 35px;
      margin-top: -5px;
    }
  }
  &.selected {
    background: rgba(255, 255, 255, 0.1);
    &:before {
      background: var(--primary-color);
      opacity: 1;
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
