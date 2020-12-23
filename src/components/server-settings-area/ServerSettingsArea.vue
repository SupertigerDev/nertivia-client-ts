<template>
  <div class="explore-area">
    <Header :title="page.name" />
    <component v-if="page" :is="page.component" />
  </div>
</template>

<script>
import Header from "@/components/Header.vue";
import settingsPages from "@/utils/serverSettingsPages.json";
import ManageNotification from "./ManageNotification.vue";

import { Vue, Component } from "vue-property-decorator";
@Component({ components: { Header, ManageNotification } })
export default class ServerSettingsArea extends Vue {
  get page() {
    return settingsPages[this.$route.params.tab];
  }
}
</script>
<style lang="scss" scoped>
.explore-area {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}
</style>
