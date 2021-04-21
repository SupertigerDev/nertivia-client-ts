<template>
  <div class="custom-css">
    <div class="theme-list" v-if="themes">
      <theme-template v-for="theme in themes" :key="theme.id" :theme="theme" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { getThemes, ThemeDetail } from "@/services/themeService";
import ThemeTemplate from "./ThemeTemplate.vue";

@Component({ components: { ThemeTemplate } })
export default class CustomCSS extends Vue {
  themes: null | ThemeDetail[] = null;
  mounted() {
    getThemes().then(res => {
      this.themes = res;
    });
  }
}
</script>

<style lang="scss" scoped>
.custom-css {
  display: flex;
  flex-direction: column;
  overflow: auto;
}

.box {
  padding: 10px;
  align-self: flex-start;
  margin-left: 5px;
}
.theme-list {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 5px;
}
</style>
