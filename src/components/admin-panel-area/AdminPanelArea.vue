<template>
  <div class="admin-area">
    <Header v-if="page" :title="page.name" />
    <component v-if="page" :is="page.component" />
  </div>
</template>

<script lang="ts">
import Header from "@/components/Header.vue";
import Overview from "./overview/Overview.vue";
import explorePages from "@/utils/adminPanelPages.json";
import { TabsModule } from "@/store/modules/tabs";
import Vue from "vue";
import { defineComponent } from "vue";
export default defineComponent({
  name: "ExploreArea",
  components: { Header, Overview },
  computed: {
    page(): any {
      return explorePages[this.$route.params.tab as string];
    }
  },
  watch: {
    page: {
      handler: "onPageChanged"
    }
  },
  mounted() {
    if (!this.page) {
      this.$router.replace("/app/admin-panel/overview");
      return;
    }
    TabsModule.setCurrentTab({
      icon: "security",
      name: "Admin Panel " + this.page.name
    });
  },
  methods: {
    onPageChanged() {
      TabsModule.setCurrentTab({
        icon: "security",
        name: "Admin Panel " + this.page.name
      });
    }
  }
});
</script>
<style lang="scss" scoped>
.admin-area {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}
</style>
