<template>
  <div class="explore-server">
    <div class="server-list" v-if="data.length">
      <ServerTemplate
        v-for="server in data"
        :data="server"
        :key="server.server.server_id"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { ServerResponse, getServers } from "@/services/exploreService";
import ServerTemplate from "./ExploreServerTemplate.vue";
import { Vue, Component } from "vue-property-decorator";
@Component({ components: { ServerTemplate } })
export default class ExploreArea extends Vue {
  data: ServerResponse[] = [];
  async mounted() {
    this.data = await getServers();
  }
}
</script>

<style lang="scss" scoped>
.server-list {
  display: flex;
  flex-wrap: wrap;
}
</style>
