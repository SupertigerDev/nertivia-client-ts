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
        name="Welcome Popout"
        class="check-box"
        description="Show a welcome popout when you first create an account."
        v-model="welcomePopout"
      /> -->
    </div>
  </div>
</template>

<script lang="ts">
import CheckBox from "@/components/CheckBox.vue";

import { defineComponent } from "vue";
export default defineComponent({
  name: "WIPFeatures",
  // components: { CheckBox },
  data() {
    return {
      welcomePopout: localStorage["welcomePopout_wip"] === "true",
    };
  },
  watch: {
    welcomePopout() {
      localStorage["welcomePopout_wip"] = this.welcomePopout;
    },
  },
});
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
