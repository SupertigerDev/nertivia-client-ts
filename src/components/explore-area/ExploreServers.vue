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
.explore-server {
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: hidden;
}
.server-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, 300px);
  justify-content: center;
  grid-gap: 20px;
  padding: 20px;
  overflow: auto;
  padding-bottom: 100px;
}
@media (max-width: 344px) {
  .server-list {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}
</style>
