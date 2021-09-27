<template>
  <div class="server-settings-area">
    <Header :title="$t(`server-settings.tab-names.${page.id}`)" />
    <component v-if="page" :is="page.component" :key="serverID" />
  </div>
</template>

<script lang="ts">
import Header from "@/components/Header.vue";
import settingsPages from "@/utils/serverSettingsPages.json";
import ManageNotification from "./ManageNotification.vue";
import ManageInvites from "./manage-invites/ManageInvites.vue";
import ManageChannels from "./manage-channels/ManageChannels.vue";
import ManageRoles from "./manage-roles/ManageRoles.vue";
import ManageUsers from "./manage-users/ManageUsers.vue";
import BannedUsers from "./banned-users/BannedUsers.vue";
import DeleteServer from "./DeleteServer.vue";
import General from "./General.vue";
import ServerVisibility from "./ServerVisibility.vue";
import { TabsModule } from "@/store/modules/tabs";

import { defineComponent } from "vue";
export default defineComponent({
  name: "ServerSettingsArea",
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
    ServerVisibility,
  },
  computed: {
    page(): any {
      const id = this.$route.params.tab as string;
      return { ...settingsPages[id], id };
    },
    serverID(): any {
      return this.$route.params.server_id;
    },
  },
  watch: {
    page: {
      handler: "onPageChanged",
    },
  },
  mounted() {
    if (!this.page.id) {
      this.$router.replace({ params: { tab: "general" } });
      return;
    }
    TabsModule.setCurrentTab({
      icon: this.page.icon,
      name: this.page.name + " Settings",
    });
  },
  methods: {
    onPageChanged() {
      if (!this.page) return;

      TabsModule.setCurrentTab({
        icon: this.page?.icon,
        name: this.page?.name + " Settings",
      });
    },
  },
});
</script>
<style lang="scss" scoped>
.server-settings-area {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}
</style>
