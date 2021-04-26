<template>
  <div class="container">
    <CustomButton name="New Theme" icon="add" />
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
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { getThemes, ThemePreview } from "@/services/themeService";
import ThemeTemplate from "./ThemeTemplate.vue";
import CustomButton from "@/components/CustomButton.vue";

@Component({ components: { ThemeTemplate, CustomButton } })
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
.container {
}
.theme-list {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 5px;
}
</style>
