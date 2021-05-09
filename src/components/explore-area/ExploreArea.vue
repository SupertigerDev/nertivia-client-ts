<template>
  <div class="explore-area">
    <Header v-if="page" :title="page.name" />
    <component v-if="page" :is="page.component" />
  </div>
</template>

<script>
import Header from "@/components/Header.vue";
import ExploreServers from "./ExploreServers.vue";
import ExploreThemes from "./ExploreThemes.vue";
import { Vue, Component } from "vue-property-decorator";
import explorePages from "@/utils/explorePages";
@Component({ components: { Header, ExploreServers, ExploreThemes } })
export default class ExploreArea extends Vue {
  mounted() {
    if (!this.page) {
      this.$router.push("/app/explore/servers");
    }
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
