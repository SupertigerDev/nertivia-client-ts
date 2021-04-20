<template>
  <div class="custom-css">
    <div class="box">
      <div class="theme-list" v-if="themes">
        <div class="item" v-for="theme in themes" :key="theme.id">
          {{ theme.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { getThemes, ThemeDetail } from "@/services/themeService";

@Component
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
  .item {
    display: flex;
    padding: 5px;
    cursor: pointer;
    border-radius: 4px;
    user-select: none;
    &:hover {
      background: rgba(255, 255, 255, 0.05);
    }
  }
}
</style>
