<template>
  <div class="dashboard-area">
    <Header title="Dashboard" />
    <div class="content">
      <ProfileCard />
      <NotificationCard />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

import Header from "@/components/Header.vue";
import NotificationCard from "./NotificationCard.vue";
import ProfileCard from "./ProfileCard.vue";
import { TabsModule } from "@/store/modules/tabs";
@Component({ components: { NotificationCard, ProfileCard, Header } })
export default class DashboardArea extends Vue {
  mounted() {
    TabsModule.setCurrentTab({ name: "Dashboard", icon: "dashboard" });
  }
}
</script>

<style lang="scss" scoped>
.dashboard-area {
  display: flex;
  flex-direction: column;
  overflow: auto;
}
.content {
  display: flex;
  flex-wrap: wrap;
}
</style>

<style scoped>
@media (max-width: 564px) {
  .dashboard-area .card {
    width: 100%;
  }
}
</style>
