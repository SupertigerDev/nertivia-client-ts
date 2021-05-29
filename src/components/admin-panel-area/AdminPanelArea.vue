<template>
  <div class="explore-area">
    <Header v-if="page" :title="page.name" />
    <component v-if="page" :is="page.component" />
  </div>
</template>

<script>
import Header from "@/components/Header.vue";
import Overview from "./overview/Overview.vue";
import { Vue, Component } from "vue-property-decorator";
import explorePages from "@/utils/adminPanelPages";
@Component({ components: { Header, Overview } })
export default class ExploreArea extends Vue {
  mounted() {
    if (!this.page) {
      this.$router.replace("/app/admin-panel/overview");
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
