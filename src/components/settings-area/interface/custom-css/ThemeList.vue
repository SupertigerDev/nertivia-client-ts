<template>
  <div class="container">
    <CustomButton
      v-if="themes"
      @click="createTheme"
      name="New Theme"
      icon="add"
    />
    <div class="theme-list" v-if="themes">
      <themeTemplate
        v-for="theme in themes"
        :key="theme.id"
        @clicked="clickedID = theme.id"
        @delete="deleteTheme"
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
import {
  createTheme,
  deleteTheme,
  getThemes,
  ThemePreview
} from "@/services/themeService";
import ThemeTemplate from "./ThemeTemplate.vue";
import CustomButton from "@/components/CustomButton.vue";
import { unapplyTheme } from "@/utils/CSSTheme";

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
  createTheme() {
    createTheme({
      name: "Untitled",
      css: this.cssTemplate()
    }).then(theme => {
      this.themes?.push(theme);
      this.$emit("edit", theme.id);
    });
  }
  deleteTheme(id: string) {
    deleteTheme(id).then(() => {
      unapplyTheme();
      this.themes = this.themes?.filter(t => t.id !== id) || null;
    });
  }
  cssTemplate() {
    return `/* Background image example*/
body {
 background-image: url("https://media.nertivia.net/763085785093499319/6792472026104729600/hd-wallpaper-mountain-range-mountains-114979.jpg");  
 backdrop-filter: blur(10px) brightness(40%);
}
.drawer-layout .drawer-container {
	background: rgba(0,0,0,0.2) !important; 
}
.drawer-layout .drawer-container .container {
  background: rgba(0,0,0,0.2) !important; 
}`;
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
