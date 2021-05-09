<template>
  <div class="explore-server">
    <div class="notice">
      <div class="material-icons icon">info</div>
      <span>Themes are manually reviewed and are safe to use.</span>
    </div>

    <div class="container">
      <!-- <div class="filters">
        <CustomDropDown
          title="Filter"
          :items="filters"
          IdPath="param"
          defaultId="compatible"
          @change="selectedFilter = $event"
        />
      </div> -->
      <LoadingScreen class="loading" v-if="!data" />
      <div class="server-list" v-if="data">
        <ThemeTemplate
          class="theme"
          v-for="(theme, i) in data"
          :data="theme"
          :appliedThemeID="appliedThemeID"
          @unapplied="appliedThemeID = null"
          @applied="appliedThemeID = theme.id"
          @liked="liked(i)"
          @unliked="unliked(i)"
          :key="theme.id"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  getPublicThemes,
  PublicThemeResponse
} from "@/services/exploreService";
import ThemeTemplate from "./ExploreThemeTemplate.vue";
import CustomDropDown from "@/components/CustomDropDown.vue";
import LoadingScreen from "@/components/LoadingScreen.vue";
import { Vue, Component, Watch } from "vue-property-decorator";
@Component({ components: { ThemeTemplate, CustomDropDown, LoadingScreen } })
export default class ExploreThemes extends Vue {
  data: PublicThemeResponse[] = [];
  appliedThemeID = localStorage["themeID"] || null;
  filters = [
    { name: "Compatible", param: "compatible" },
    { name: "All", param: undefined }
  ];
  selectedFilter = this.filters[0].param;
  async mounted() {
    this.loadData();
  }
  async loadData() {
    this.data = [];
    this.data = (await getPublicThemes(
      undefined,
      undefined,
      this.$lastUIBreakingVersion
    )) as any;
  }
  liked(index: number) {
    const newData = this.data?.[index];
    if (!newData) return;
    if (newData.likes === undefined) return;
    newData.liked = true;
    newData.likes += 1;
    this.$set(this.data, index, newData);
  }
  unliked(index: number) {
    const newData = this.data?.[index];
    if (!newData) return;
    if (newData.likes === undefined) return;
    newData.liked = false;
    newData.likes -= 1;
    this.$set(this.data, index, newData);
  }
  @Watch("selectedFilter")
  async onFilterChange() {
    this.loadData();
  }
}
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
  padding-top: 10px;
}
.server-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  grid-gap: 20px;
  align-items: stretch;
  .theme {
    flex: 1;
  }
}
.notice {
  display: flex;
  align-content: center;
  align-items: center;
  overflow: hidden;
  margin-top: 5px;
  background: var(--success-color);
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
