<template>
  <div class="server-settings-area">
    <Header :title="$t(`server-settings.tab-names.${page.id}`)" />
    <component v-if="page" :is="page.component" :key="serverID" />
  </div>
</template>

<script>
import Header from "@/components/Header.vue";
import settingsPages from "@/utils/serverSettingsPages.json";
import ManageNotification from "./ManageNotification.vue";
import ManageInvites from "./manage-invites/ManageInvites";
import ManageChannels from "./manage-channels/ManageChannels.vue";
import ManageRoles from "./manage-roles/ManageRoles.vue";
import ManageUsers from "./manage-users/ManageUsers.vue";
import BannedUsers from "./banned-users/BannedUsers.vue";
import DeleteServer from "./DeleteServer.vue";
import General from "./General.vue";
import ServerVisibility from "./ServerVisibility.vue";

import { Vue, Component, Watch } from "vue-property-decorator";
import { TabsModule } from "@/store/modules/tabs";
@Component({
  components: {
    Header,
    ManageNotification,
    ManageUsers,
    ManageChannels,
    ManageRoles,
    ManageInvites,
    General,
    DeleteServer,
    BannedUsers,
    ServerVisibility
  }
})
export default class ServerSettingsArea extends Vue {
  mounted() {
    if (!this.page.id) {
      this.$router.replace({ params: { tab: "general" } });
      return;
    }
    TabsModule.setCurrentTab({
      icon: this.page.icon,
      name: this.page.name + " Settings"
    });
  }
  @Watch("page")
  onPageChanged() {
    TabsModule.setCurrentTab({
      icon: this.page.icon,
      name: this.page.name + " Settings"
    });
  }
  get page() {
    const id = this.$route.params.tab;
    return { ...settingsPages[id], id };
  }
  get serverID() {
    return this.$route.params.server_id;
  }
}
</script>
<style lang="scss" scoped>
.server-settings-area {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}
</style>
