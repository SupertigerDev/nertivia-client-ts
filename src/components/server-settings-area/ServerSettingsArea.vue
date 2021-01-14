<template>
  <div class="server-settings-area">
    <Header :title="page.name" />
    <component v-if="page" :is="page.component" :key="serverID" />
  </div>
</template>

<script>
import Header from "@/components/Header.vue";
import settingsPages from "@/utils/serverSettingsPages.json";
import ManageNotification from "./ManageNotification.vue";
import ManageInvites from "./ManageInvites/ManageInvites.vue";
import ManageUsers from "./ManageUsers/ManageUsers.vue";

import { Vue, Component } from "vue-property-decorator";
@Component({
  components: { Header, ManageNotification, ManageUsers, ManageInvites }
})
export default class ServerSettingsArea extends Vue {
  get page() {
    return settingsPages[this.$route.params.tab];
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
