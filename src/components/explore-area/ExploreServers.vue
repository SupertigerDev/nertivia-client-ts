<template>
  <div class="explore-server">
    <div class="notice">
      <div class="material-icons icon">info</div>
      <span
        >Servers are not being actively monitored. Please report servers that
        don't follow the
        <a
          href="/terms-and-conditions"
          target="_blank"
          rel="noopener noreferrer"
          >TOS</a
        >.
      </span>
    </div>

    <div class="container">
      <div class="filters">
        <CustomDropDown
          title="Filter"
          :items="filters"
          IdPath="param"
          defaultId="verified=true"
          @change="filterParam = $event"
        />
        <CustomDropDown
          title="Sort"
          :items="sorts"
          IdPath="param"
          defaultId=""
          @change="sortParam = $event"
        />
      </div>
      <LoadingScreen class="loading" v-if="!data" />
      <div class="server-list" v-if="data">
        <ServerTemplate
          class="server"
          v-for="server in data"
          :data="server"
          :key="server.server.server_id"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ServerResponse, getServers } from "@/services/exploreService";
import ServerTemplate from "./ExploreServerTemplate.vue";
import CustomDropDown from "@/components/CustomDropDown.vue";
import LoadingScreen from "@/components/LoadingScreen.vue";

import { defineComponent } from "vue";
export default defineComponent({
  name: "ExploreArea",
  components: { ServerTemplate, CustomDropDown, LoadingScreen },
  data() {
    return {
      sortParam: "",
      filterParam: "verified=true",
      data: null as ServerResponse[] | null,
      filters: [
        { name: "Verified Servers", param: "verified=true" },
        { name: "All Servers", param: "" },
      ],
      sorts: [
        { name: "Most Users", param: "" },
        { name: "Least Users", param: "most_users=false" },
        { name: "Alphabetical", param: "alphabetical=true" },
        { name: "Date Added", param: "date_added=true" },
      ],
    };
  },
  computed: {
    buildParam(): any {
      if (!this.sortParam && this.filterParam) {
        return `?${this.filterParam}`;
      }
      if (this.sortParam && !this.filterParam) {
        return `?${this.sortParam}`;
      }
      return `?${this.sortParam}&${this.filterParam}`;
    },
  },
  watch: {
    buildParam: {
      handler: "onFilterChange",
    },
  },
  async mounted() {
    this.data = await getServers();
  },
  methods: {
    async onFilterChange() {
      this.data = null;
      this.data = await getServers(this.buildParam);
    },
  },
});
</script>

<style lang="scss" scoped>
.explore-server {
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: hidden;
  height: 100%;
}
.container {
  display: flex;
  flex-direction: column;
  padding-left: 50px;
  padding-right: 50px;
  overflow: auto;
  height: 100%;
  padding-bottom: 10px;
}
.server-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  grid-gap: 20px;
  align-items: stretch;
  gap: 10px;
  .server {
    flex: 1;
  }
}
.notice {
  display: flex;
  align-content: center;
  align-items: center;
  overflow: hidden;
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
.filters {
  display: flex;
  flex-shrink: 0;
  margin-top: 10px;
  margin-bottom: -10px;
  .input {
    flex-shrink: initial;
  }
  .loading {
    height: 100%;
  }
}
@media (max-width: 344px) {
  .server-list {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}
</style>
