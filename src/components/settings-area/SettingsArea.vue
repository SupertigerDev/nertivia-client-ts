<template>
  <div>
    <Header :title="selectedTab.name" />
    <component :is="selectedTab.component" />
  </div>
</template>

<script>
const Interface = () =>
  import(
    /* webpackChunkName: "Interface" */ "@/components/settings-area/Interface.vue"
  );
import Header from "@/components/Header.vue";
import settingPages from "@/utils/settingPages.json";
import { Vue, Component } from "vue-property-decorator";
@Component({ components: { Header, Interface } })
export default class SettingsArea extends Vue {
  mounted() {
    if (!this.selectedTab) {
      this.$router.push({ params: { tab: "account" } });
    }
  }
  get selectedTab() {
    const tab = this.$route.params.tab;
    if (tab) {
      return settingPages[tab];
    }
    return undefined;
  }
}
</script>
