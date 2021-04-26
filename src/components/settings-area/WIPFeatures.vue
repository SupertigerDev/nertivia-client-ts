<template>
  <!-- Dont add translations for this file. -->
  <div class="wip-features">
    <div class="box">
      <div class="description">
        <div class="material-icons">info</div>
        Enable un-finished or experimental features.
      </div>
      <div style="opacity: 0.6">No WIP Features available right now.</div>
      <!-- <CheckBox
        name="CSS Themes"
        class="check-box"
        description="Create and apply CSS Themes through interface settings."
        v-model="CSSThemes"
      /> -->
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import CheckBox from "@/components/CheckBox.vue";

@Component({ components: { CheckBox } })
export default class WIPFeatures extends Vue {
  // im lazy to add it properly D: adding multiple wip features will get messy.
  // CSSThemes = localStorage["CSSThemes_wip"] === "true";
  // @Watch("CSSThemes")
  // onChange() {
  //   localStorage["CSSThemes_wip"] = this.CSSThemes;
  // }
}
</script>

<style lang="scss" scoped>
.wip-features {
  display: flex;
  flex-direction: column;
}
.description {
  display: flex;
  align-items: center;
  align-content: center;
  .material-icons {
    margin-right: 5px;
  }
  margin-bottom: 10px;
}
.title {
  margin-bottom: 5px;
}
.box {
  padding: 10px;
  align-self: flex-start;
}
.check-box {
  margin-bottom: 10px;
}
</style>
