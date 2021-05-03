<template>
  <div class="custom-css">
    <Editor v-if="editID" :themeID="editID" @back="editID = null" />
    <PublishOptions
      v-if="publishTheme"
      :theme="publishTheme"
      @back="publishTheme = null"
    />
    <ThemeList
      v-if="!editID && !publishTheme"
      @edit="editID = $event"
      @publish="publishTheme = $event"
    />
  </div>
</template>

<script lang="ts">
import { Theme } from "@/services/themeService";
import { Component, Vue } from "vue-property-decorator";
import ThemeList from "./ThemeList.vue";
const Editor = () => import(/* webpackChunkName: "Editor" */ "./Editor.vue");
const PublishOptions = () =>
  import(/* webpackChunkName: "PublishOptions" */ "./PublishOptions.vue");

@Component({ components: { ThemeList, Editor, PublishOptions } })
export default class CustomCSS extends Vue {
  editID: null | string = null;
  publishTheme: null | Theme = null;
}
</script>

<style lang="scss" scoped>
.custom-css {
  display: flex;
  flex-direction: column;
  overflow: auto;
}
</style>
