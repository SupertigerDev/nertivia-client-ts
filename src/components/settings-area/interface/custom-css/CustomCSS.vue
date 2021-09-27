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
import ThemeList from "./ThemeList.vue";
import { defineAsyncComponent } from "vue";

const Editor = defineAsyncComponent(() => import("./Editor.vue"));
const PublishOptions = defineAsyncComponent(
  () => import("./PublishOptions.vue")
);
import { defineComponent } from "vue";
export default defineComponent({
  name: "CustomCSS",
  components: { ThemeList, Editor, PublishOptions },
  data() {
    return {
      editID: null as null | string,
      publishTheme: null as null | Theme,
    };
  },
});
</script>

<style lang="scss" scoped>
.custom-css {
  display: flex;
  flex-direction: column;
  overflow: auto;
}
</style>
