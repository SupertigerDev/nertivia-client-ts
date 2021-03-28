<template>
  <div class="explore-server">
    <div class="notice">
      <div class="material-icons icon">info</div>
      Servers are not being actively monitored. Please report servers that dont
      follow the
      <a href="/terms-and-conditions" target="_blank" rel="noopener noreferrer"
        >TOS</a
      >.
    </div>
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
  margin-bottom: 10px;
}
.server-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, 300px);
  justify-content: center;
  grid-gap: 20px;
  // padding: 20px;
  overflow: auto;
  margin-top: 10px;
  // padding-bottom: 100px;
}
.notice {
  text-align: center;
  display: flex;
  align-content: center;
  align-items: center;
  align-self: center;
  margin-top: 5px;
  background: var(--warn-color);
  border-radius: 4px;
  padding: 5px;
  margin-left: 5px;
  margin-right: 5px;
  .icon {
    margin-right: 5px;
  }
  a {
    margin-left: 2px;
    color: white;
  }
}
@media (max-width: 344px) {
  .server-list {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}
</style>
