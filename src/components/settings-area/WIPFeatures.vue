<template>
  <!-- Dont add translations for this file. -->
  <div class="wip-features">
    <div class="box">
      <div class="description">
        <div class="material-icons">info</div>
        Enable un-finished or experimental features.
      </div>
      <!-- <div style="opacity: 0.6">No WIP Features available right now.</div> -->
      <CheckBox
        name="HTML Profile"
        class="check-box"
        description="Add some HTML to your profile. "
        v-model="htmlProfile"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import CheckBox from "@/components/CheckBox.vue";

export default Vue.extend({
  name: "WIPFeatures",
  components: { CheckBox },
  data() {
    return {
      htmlProfile: localStorage["htmlProfile_wip"] === "true"
    };
  },
  watch: {
    htmlProfile() {
      localStorage["htmlProfile_wip"] = this.htmlProfile;
    }
  }
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
