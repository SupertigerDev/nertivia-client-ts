<template>
  <div class="html-profile" v-if="wipEnabled">
    <InformationTemplate
      title="HTML Profile"
      information="Add custom HTML near the top of your profile popout."
    />
    <CustomButton
      icon="code"
      name="Edit HTML"
      class="button"
      v-if="!showEditor"
      @click="showEditor = !showEditor"
    />
    <CustomInput
      class="editor"
      v-if="showEditor"
      title="HTML Code"
      v-model="htmlCode"
      :textArea="true"
    />
    <CustomButton
      icon="save"
      v-if="showEditor"
      name="Save HTML Code"
      class="button"
      @click="showEditor != showEditor"
    />
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import CustomButton from "@/components/CustomButton.vue";
import CustomInput from "@/components/CustomInput.vue";
import InformationTemplate from "@/components/InformationTemplate.vue";
export default Vue.extend({
  components: { CustomButton, InformationTemplate, CustomInput },
  data() {
    return {
      htmlCode: "Test",
      wipEnabled: localStorage["htmlProfile_wip"] === "true",
      showEditor: false
    };
  }
});
</script>

<style scoped lang="scss">
.html-profile {
  margin-left: 15px;
  margin-right: 10px;
}
.button {
  align-self: flex-start;
  margin-top: 10px;
}
.editor {
  margin-top: 10px;
  margin-bottom: -20px;
}
</style>
