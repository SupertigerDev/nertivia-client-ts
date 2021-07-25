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
import { Vue, Component, Watch } from "vue-property-decorator";
import explorePages from "@/utils/explorePages.json";
import { TabsModule } from "@/store/modules/tabs";
@Component({ components: { Header, ExploreServers, ExploreThemes } })
export default class ExploreArea extends Vue {
  mounted() {
    if (!this.page) {
      this.$router.push("/app/explore/servers");
      return;
    }
    TabsModule.setCurrentTab({ name: "Explore " + this.page.name });
  }
  @Watch("page")
  onPageChanged() {
    TabsModule.setCurrentTab({ name: "Explore " + this.page.name });
  }
  get page() {
    return explorePages[this.$route.params.tab];
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
