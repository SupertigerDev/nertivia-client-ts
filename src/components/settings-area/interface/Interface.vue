<template>
  <div class="interface">
    <div class="description">
      <div class="material-icons">info</div>
      {{ $t("settings.interface.description") }}
    </div>
    <TabLayout :tabs="tabs" />
  </div>
</template>

<script lang="ts">
import TabLayout from "@/components/TabLayout.vue";
import ColorScheme from "./GeneralInterface.vue";
import CustomCSS from "./custom-css/CustomCSS.vue";

import { defineComponent } from "vue";
export default defineComponent({
  name: "Interface",
  components: { TabLayout },
  computed: {
    tabs(): any {
      const tabs: any = [
        {
          name: this.$t("settings.interface.general"),
          id: "color_scheme",
          component: ColorScheme,
        },
        {
          name: this.$t("settings.interface.custom-css"),
          id: "custom_css",
          component: CustomCSS,
        },
      ];

      return tabs;
    },
  },
});
</script>

<style lang="scss" scoped>
.interface {
  display: flex;
  position: relative;
  flex-direction: column;
  height: 100%;
  margin: 10px;
}
.description {
  display: flex;
  align-items: center;
  align-content: center;
  margin-bottom: 10px;
  .material-icons {
    margin-right: 5px;
  }
}
</style>
