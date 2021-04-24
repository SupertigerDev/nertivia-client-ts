<template>
  <div class="theme-list" v-if="themes">
    <themeTemplate
      v-for="theme in themes"
      :key="theme.id"
      @clicked="clickedID = theme.id"
      @edit="$emit('edit', theme.id)"
      @applied="appliedThemeID = theme.id"
      @unapplied="appliedThemeID = null"
      :applied="appliedThemeID === theme.id"
      :showOptions="clickedID === theme.id"
      :theme="theme"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { getThemes, ThemePreview } from "@/services/themeService";
import ThemeTemplate from "./ThemeTemplate.vue";

@Component({ components: { ThemeTemplate } })
export default class ThemeList extends Vue {
  themes: null | ThemePreview[] = null;
  clickedID: null | string = null;
  appliedThemeID: string | null = localStorage["themeID"] || null;
  mounted() {
    getThemes().then(res => {
      this.themes = res;
    });
  }
}
</script>

<style lang="scss" scoped>
.theme-list {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 5px;
}
</style>
