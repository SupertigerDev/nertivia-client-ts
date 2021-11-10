<template>
  <div class="gif-panel">
    <input
      type="text"
      class="input"
      ref="search"
      placeholder="Search"
      v-model="search"
    />
    <Categories
      v-if="!search.trim().length"
      :items="categories"
      @search="search = $event"
    />
  </div>
</template>

<script lang="ts">
import VirtualList from "@supertiger/vue-3-virtual-scroll-list";
import { defineComponent } from "vue";
import { tenorCategories, TenorCategory } from "@/services/tenorService";
import Categories from "./Categories.vue";

export default defineComponent({
  props: ["inputElement"],
  emits: ["click", "close"],
  components: { Categories },
  data() {
    return {
      search: "",
      categories: [] as TenorCategory[],
    };
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
