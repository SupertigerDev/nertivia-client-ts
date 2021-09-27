<template>
  <div class="settings-drawer">
    <div class="items">
      <div
        class="item"
        v-for="(page, index) in pages"
        :key="index"
        :class="{ selected: page.id === currentTab }"
        @click="changeTab(page.id)"
      >
        <div class="material-icons">{{ page.icon }}</div>
        <div class="name">{{ page.name }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import explorePages from "@/utils/explorePages.json";
import { DrawersModule } from "@/store/modules/drawers";

import { defineComponent } from "vue";
export default defineComponent({
  name: "MainApp",
  data() {
    return {
      pages: explorePages,
    };
  },
  computed: {
    currentTab(): any {
      return this.$route.params.tab;
    },
  },
  methods: {
    changeTab(path: string) {
      DrawersModule.SetLeftDrawer(false);
      this.$router.push({ params: { tab: path } });
    },
  },
});
</script>
<style lang="scss" scoped>
.settings-drawer {
  width: 250px;
}
.item {
  display: flex;
  align-items: center;
  align-content: center;
  height: 30px;
  margin: 4px;
  padding-left: 4px;
  cursor: pointer;
  position: relative;
  overflow: auto;
  user-select: none;
  color: white;
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
    background: rgba(255, 255, 255, 0.1);
    opacity: 1;
    &:before {
      content: "";
      position: absolute;
      background: var(--primary-color);
      left: 0;
      top: 0;
      width: 3px;
      bottom: 0;
    }
  }
}
@media (max-width: 950px) {
  .settings-drawer {
    padding-bottom: 56px;
  }
}
</style>
