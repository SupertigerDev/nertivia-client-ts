<template>
  <div class="publish-options" v-if="theme">
    <div class="info">
      <InformationTemplate
        title="Make your theme appear in the explore tab so others can use it."
      />
      <InformationTemplate
        title="To change the name, go to the edit page in custom CSS."
      />
    </div>
    <div class="box">
      <CustomInput :value="theme.name" title="Name" :disabled="true" />
      <CustomInput title="Description" :textArea="true" value="test" />
      <CustomButton
        style="align-self: flex-start"
        icon="navigate_before"
        name="Back"
        @click="$emit('back')"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { getPublicTheme } from "@/services/exploreService";
import CustomButton from "@/components/CustomButton.vue";
import CustomInput from "@/components/CustomInput.vue";
import { Theme } from "@/services/themeService";
import InformationTemplate from "@/components/InformationTemplate.vue";

@Component({ components: { CustomButton, CustomInput, InformationTemplate } })
export default class PublishOptions extends Vue {
  @Prop() private theme!: Theme;

  async mounted() {
    console.log(this.theme.name);
    console.log(await getPublicTheme(this.theme.id));
  }
}
</script>

<style lang="scss" scoped>
.publish-options {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}
.menu-strip {
  display: flex;
  flex-shrink: 0;
  align-items: center;
}
.info {
  margin: 10px;
}
.box {
  display: flex;
  flex-direction: column;
  max-width: 300px;
  margin: 10px;
}
.info div {
  margin-top: 5px;
  opacity: 0.7;
}
</style>
