<template>
  <div class="settings-view">
    <Header
      v-if="selectedTab"
      :title="$t(`settings.tab-names.${selectedTab.id}`)"
    />
    <component v-if="selectedTab" :is="selectedTab.component" />
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent } from "vue";

const Interface = defineAsyncComponent(
  () => import("@/components/settings-area/interface/Interface.vue")
);
const Account = defineAsyncComponent(
  () => import("@/components/settings-area/Account.vue")
);
const Notification = defineAsyncComponent(
  () => import("@/components/settings-area/Notification.vue")
);
const ManageEmojis = defineAsyncComponent(
  () => import("@/components/settings-area/manage-emojis/ManageEmojis.vue")
);
const ManageBots = defineAsyncComponent(
  () => import("@/components/settings-area/manage-bots/ManageBots.vue")
);
const DeleteAccount = defineAsyncComponent(
  () => import("@/components/settings-area/DeleteAccount.vue")
);
const StartupOptions = defineAsyncComponent(
  () => import("@/components/settings-area/StartupOptions.vue")
);
const CallOptions = defineAsyncComponent(
  () => import("@/components/settings-area/CallOptions.vue")
);
const ProgramActivity = defineAsyncComponent(
  () =>
    import("@/components/settings-area/program-activity/ProgramActivity.vue")
);
const Language = defineAsyncComponent(
  () => import("@/components/settings-area/Language.vue")
);
const WIPFeatures = defineAsyncComponent(
  () => import("@/components/settings-area/WIPFeatures.vue")
);
import Header from "@/components/Header.vue";
import { TabsModule } from "@/store/modules/tabs";
import settingPages from "@/utils/settingPages.json";
import { defineComponent } from "vue";
export default defineComponent({
  name: "SettingsArea",
  components: {
    Header,
    Interface,
    Account,
    Notification,
    ManageEmojis,
    ManageBots,
    DeleteAccount,
    StartupOptions,
    ProgramActivity,
    Language,
    WIPFeatures,
    CallOptions,
  },
  computed: {
    selectedTab(): any {
      const tab = this.$route.params.tab;
      if (typeof tab === "string") {
        return { ...settingPages[tab], id: tab };
      }
      return undefined;
    },
  },
  watch: {
    selectedTab: {
      handler: "onPageChanged",
    },
  },
  mounted() {
    if (!this.selectedTab) {
      this.$router.replace({ params: { tab: "account" } });
      return;
    }
    TabsModule.setCurrentTab({
      icon: this.selectedTab.icon,
      name: this.selectedTab.name + " Settings",
    });
  },
  methods: {
    onPageChanged() {
      if (!this.selectedTab) return;
      TabsModule.setCurrentTab({
        icon: this.selectedTab?.icon,
        name: this.selectedTab?.name + " Settings",
      });
    },
  },
});
</script>
<style lang="scss" scoped>
.settings-view {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>
