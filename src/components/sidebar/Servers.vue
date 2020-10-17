<template>
  <div class="server-list">
    <ServerTemplate
      v-for="server in Servers"
      :key="server.server_id"
      :server="server"
    />
  </div>
</template>

<script lang="ts">
import { ServersModule } from "@/store/modules/servers";
import { Component, Vue } from "vue-property-decorator";
import ServerTemplate from "./ServerTemplate.vue";

@Component({ components: { ServerTemplate } })
export default class MainApp extends Vue {
  get Servers() {
    return Object.values(ServersModule.servers).reverse();
  }
}
</script>

<style lang="scss" scoped>
.server-list {
  overflow: auto;
  width: 100%;
}

/* Hide scrollbar for Chrome, Safari and Opera */
.server-list::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.server-list {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style>
