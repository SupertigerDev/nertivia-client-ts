<template>
  <div class="explore-area">
    <Header v-if="page" :title="page.name" />
    <component v-if="page" :is="page.component" />
  </div>
</template>

<script lang="ts">
import Header from "@/components/Header.vue";
import ExploreServers from "./ExploreServers.vue";
import ExploreThemes from "./ExploreThemes.vue";
import explorePages from "@/utils/explorePages.json";
import { TabsModule } from "@/store/modules/tabs";

import { defineComponent } from "vue";
export default defineComponent({
  name: "ExploreArea",
  components: { Header, ExploreServers, ExploreThemes },
  computed: {
    page(): any {
      return explorePages[this.$route.params.tab as string];
    },
  },
  watch: {
    page: {
      handler: "onPageChanged",
    },
  },
  mounted() {
    if (!this.page) {
      this.$router.push("/app/explore/servers");
      return;
    }
    TabsModule.setCurrentTab({
      icon: "explore",
      name: "Explore " + this.page?.name,
    });
  },
  methods: {
    onPageChanged() {
      if (!this.page) return;
      TabsModule.setCurrentTab({
        icon: "explore",
        name: "Explore " + this.page?.name,
      });
    },
  },
});
</script>
<style lang="scss" scoped>
.explore-area {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}
</style>
