<template>
  <div class="overview">
    <Stats />
    <div class="content">
      <Users v-show="!selectedUser" @click="selectedUser = $event" />
      <SelectedUserPage v-if="selectedUser" :user="selectedUser" />
    </div>
  </div>
</template>

<script lang="ts">
import { ExpandedUser } from "@/services/adminService";
import { Vue, Component, Prop } from "vue-property-decorator";
import Stats from "./Stats.vue";
import Users from "./Users.vue";
import SelectedUserPage from "./SelectedUserPage.vue";

@Component({ components: { Stats, Users, SelectedUserPage } })
export default class Overview extends Vue {
  selectedUser: ExpandedUser | null = null;
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
