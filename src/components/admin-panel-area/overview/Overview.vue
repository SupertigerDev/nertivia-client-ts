<template>
  <div class="overview">
    <Stats />
    <div class="content">
      <Users
        ref="users"
        v-show="!selectedUser"
        @click="selectedUser = $event"
      />
      <AdminActions v-show="!selectedUser" />

      <SelectedUserPage
        @suspended="suspendUser"
        @back="selectedUser = null"
        v-if="selectedUser"
        :user="selectedUser"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { ExpandedUser } from "@/services/adminService";
import { Vue, Component, Prop, Ref } from "vue-property-decorator";
import Stats from "./Stats.vue";
import Users from "./Users.vue";
import AdminActions from "./AdminActions.vue";
import SelectedUserPage from "./SelectedUserPage.vue";

@Component({ components: { Stats, Users, SelectedUserPage, AdminActions } })
export default class Overview extends Vue {
  @Ref() readonly users!: Users;
  selectedUser: ExpandedUser | null = null;
  suspendUser() {
    if (!this.selectedUser) return;
    const newUser = { ...this.selectedUser, banned: true };
    this.users.updateUser(newUser);
    this.$set(this, "selectedUser", newUser);
  }
}
</script>

<style lang="scss" scoped>
.overview {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex: 1;
}
.content {
  display: flex;
  overflow: hidden;
}
</style>
