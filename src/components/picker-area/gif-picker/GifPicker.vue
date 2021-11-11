<template>
  <div class="gif-panel">
    <input
      type="text"
      class="input"
      ref="search"
      placeholder="Search"
      v-model="search"
    />
    <GifSearch
      :inputElement="inputElement"
      v-if="search.trim().length"
      :items="searchResults"
      @close="$emit('close')"
    />
    <Categories
      v-if="!search.trim().length"
      :items="categories"
      @search="searchImmidiate($event)"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
  tenorCategories,
  TenorCategory,
  TenorSearch,
  tenorSearch,
} from "@/services/tenorService";
import Categories from "./GifCategories.vue";
import GifSearch from "./GifSearch.vue";

export default defineComponent({
  props: ["inputElement"],
  emits: ["click", "close"],
  components: { Categories, GifSearch },
  data() {
    return {
      search: "",
      categories: [] as TenorCategory[],
      searchResults: [] as TenorSearch[],
      searchTimeout: null as null | number,
    };
  },
  methods: {
    async fetchSearch() {
      if (!this.search) return;
      this.searchResults = await tenorSearch(this.search);
    },
    searchImmidiate(value: string) {
      this.search = value;
      this.$nextTick(() => {
        if (this.searchTimeout) clearTimeout(this.searchTimeout);
        this.fetchSearch();
      });
    },
  },
  watch: {
    search() {
      if (this.searchTimeout) clearTimeout(this.searchTimeout);
      this.searchTimeout = null;
      this.searchTimeout = window.setTimeout(this.fetchSearch, 1000);
    },
  },
  async mounted() {
    this.categories = await tenorCategories();
    if (!this.$isMobile) {
      (this.$refs.search as any).focus();
    }
  },
});
</script>

<style scoped lang="scss">
.gif-panel {
  display: flex;
  flex-direction: column;
  transition: 0.3s;
  overflow: hidden;
  opacity: 0;
  animation: showUp 0.2s;
  animation-fill-mode: forwards;
}
@keyframes showUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.input {
  margin-left: 5px;
  margin-right: 5px;
  background: transparent;
  outline: none;
  border: solid 2px rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  padding: 5px;
  margin-top: 5px;
  color: white;
  transition: 0.2s;
  &:focus {
    border: solid 2px var(--primary-color);
  }
}
</style>
