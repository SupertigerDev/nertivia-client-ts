<template>
  <div class="custom-css">
    <Editor v-if="editID" :themeID="editID" @back="editID = null" />
    <ThemeList v-if="!editID" @edit="editID = $event" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ThemeList from "./ThemeList.vue";
const Editor = () => import(/* webpackChunkName: "Editor" */ "./Editor.vue");

@Component({ components: { ThemeList, Editor } })
export default class CustomCSS extends Vue {
  editID: null | string = null;
}
</script>

<style lang="scss" scoped>
.custom-css {
  display: flex;
  flex-direction: column;
  overflow: auto;
}
</style>
