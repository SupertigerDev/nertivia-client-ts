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
        name="DoodlePad"
        class="check-box"
        description="Draw and send!"
        v-model="doodlepad"
      /> -->
    </div>
  </div>
</template>

<script lang="ts">
import CheckBox from "@/components/CheckBox.vue";
import Vue from "vue";
export default Vue.extend({
  name: "WIPFeatures",
  components: { CheckBox }
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
