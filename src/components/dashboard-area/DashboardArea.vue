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

@Component({ components: { NotificationCard, ProfileCard, Header } })
export default class DashboardArea extends Vue {}
</script>

<style lang="scss" scoped>
.dashboard-area {
  display: flex;
  flex-direction: column;
}
.content {
  display: flex;
  flex-wrap: wrap;
}
</style>
