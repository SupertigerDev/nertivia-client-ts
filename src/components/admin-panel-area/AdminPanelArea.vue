<template>
  <div class="admin-area">
    <Header v-if="page" :title="page.name" />
    <component v-if="page" :is="page.component" />
  </div>
</template>

<script>
import Header from "@/components/Header.vue";
import Overview from "./overview/Overview.vue";
import { Vue, Component, Watch } from "vue-property-decorator";
import explorePages from "@/utils/adminPanelPages";
import { TabsModule } from "@/store/modules/tabs";
@Component({ components: { Header, Overview } })
export default class ExploreArea extends Vue {
  mounted() {
    if (!this.page) {
      this.$router.replace("/app/admin-panel/overview");
      return;
    }
    TabsModule.setCurrentTab({
      icon: "security",
      name: "Admin Panel " + this.page.name
    });
  }
  @Watch("page")
  onPageChanged() {
    TabsModule.setCurrentTab({
      icon: "security",
      name: "Admin Panel " + this.page.name
    });
  }
  get page() {
    return explorePages[this.$route.params.tab];
  }
}
</script>
<style lang="scss" scoped>
.admin-area {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}
</style>
