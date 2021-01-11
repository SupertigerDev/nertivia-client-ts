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
  border: solid 1px rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}
</style>
