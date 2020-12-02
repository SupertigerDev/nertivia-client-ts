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
const Account = () =>
  import(
    /* webpackChunkName: "Account" */ "@/components/settings-area/Account.vue"
  );
const Notification = () =>
  import(
    /* webpackChunkName: "Notification" */ "@/components/settings-area/Notification.vue"
  );
import Header from "@/components/Header.vue";
import settingPages from "@/utils/settingPages.json";
import { Vue, Component } from "vue-property-decorator";
@Component({ components: { Header, Interface, Account, Notification } })
export default class SettingsArea extends Vue {
  mounted() {
    if (!this.selectedTab) {
      this.$router.replace({ params: { tab: "account" } });
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
