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
        @publish="$emit('publish', theme)"
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
import {
  createTheme,
  deleteTheme,
  getThemes,
  ThemePreview,
} from "@/services/themeService";
import ThemeTemplate from "./ThemeTemplate.vue";
import CustomButton from "@/components/CustomButton.vue";
import { unapplyTheme } from "@/utils/CSSTheme";

import { defineComponent } from "vue";
export default defineComponent({
  name: "ThemeList",
  components: { ThemeTemplate, CustomButton },
  data() {
    return {
      themes: null as null | ThemePreview[],
      clickedID: null as null | string,
      appliedThemeID: localStorage["themeID"] || (null as string | null),
    };
  },
  mounted() {
    getThemes().then((res) => {
      this.themes = res;
    });
  },
  methods: {
    createTheme() {
      createTheme({
        name: "Untitled",
        css: this.cssTemplate(),
        client_version: this.$lastUIBreakingVersion,
      }).then((theme) => {
        this.themes?.push(theme);
        this.$emit("edit", theme.id);
      });
    },
    deleteTheme(id: string) {
      deleteTheme(id).then(() => {
        unapplyTheme();
        this.themes = this.themes?.filter((t) => t.id !== id) || null;
      });
    },
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
    },
  },
});
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
