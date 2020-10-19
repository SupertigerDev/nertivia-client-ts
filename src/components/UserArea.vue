<template>
  <div class="user-area">
    <ProfileCard class="card" :hideTitle="true" />
  </div>
</template>

<script lang="ts">
import { MeModule } from "@/store/modules/me";
import { Component, Vue } from "vue-property-decorator";
import ProfileCard from "@/components/dashboard-area/ProfileCard.vue";

@Component({ components: { ProfileCard } })
export default class MainApp extends Vue {
  get connected() {
    return MeModule.connected;
  }
  get connectionMessage() {
    return MeModule.connectionMessage;
  }
  get me() {
    return MeModule.user;
  }
}
</script>

<style lang="scss" scoped>
.card {
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.6);
}
</style>
