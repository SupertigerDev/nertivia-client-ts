<template>
  <div class="settings-view">
    <Header
      v-if="selectedTab"
      :title="$t(`settings.tab-names.${selectedTab.id}`)"
    />
    <component v-if="selectedTab" :is="selectedTab.component" />
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
const ManageEmojis = () =>
  import(
    /* webpackChunkName: "ManageEmojis" */ "@/components/settings-area/manage-emojis/ManageEmojis.vue"
  );
const ManageBots = () =>
  import(
    /* webpackChunkName: "ManageBots" */ "@/components/settings-area/manage-bots/ManageBots.vue"
  );
const DeleteAccount = () =>
  import(
    /* webpackChunkName: "DeleteAccount" */ "@/components/settings-area/DeleteAccount.vue"
  );
const StartupOptions = () =>
  import(
    /* webpackChunkName: "StartupOptions" */ "@/components/settings-area/StartupOptions.vue"
  );
const ProgramActivity = () =>
  import(
    /* webpackChunkName: "ProgramActivity" */ "@/components/settings-area/program-activity/ProgramActivity.vue"
  );
import Header from "@/components/Header.vue";
import settingPages from "@/utils/settingPages.json";
import { Vue, Component } from "vue-property-decorator";
@Component({
  components: {
    Header,
    Interface,
    Account,
    Notification,
    ManageEmojis,
    ManageBots,
    DeleteAccount,
    StartupOptions,
    ProgramActivity
  }
})
export default class SettingsArea extends Vue {
  mounted() {
    if (!this.selectedTab) {
      this.$router.replace({ params: { tab: "account" } });
    }
  }
  get selectedTab() {
    const tab = this.$route.params.tab;
    if (tab) {
      return { ...settingPages[tab], id: tab };
    }
    return undefined;
  }
}
</script>
<style lang="scss" scoped>
.settings-view {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>
