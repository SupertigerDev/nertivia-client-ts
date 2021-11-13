<template>
  <div class="electron-sources">
    <ElectronSourceTemplate
      v-for="source in electronSources"
      :key="source.id"
      :source="source"
      @click="onClick(source)"
      :selected="selectedSourceId === source.id"
    />
  </div>
</template>
<script lang="ts">
import { CaptureSource } from "@/interfaces/ElectronBridge";
import electronBridge from "@/utils/electronBridge";
import { defineComponent } from "@vue/runtime-core";
import ElectronSourceTemplate from "./ElectronSourceTemplate.vue";
export default defineComponent({
  components: { ElectronSourceTemplate },
  data() {
    return {
      selectedSourceId: null as null | string,
      electronSources: [] as CaptureSource[],
    };
  },
  mounted() {
    this.loadElectronCaptures();
  },
  methods: {
    onClick(source: CaptureSource) {
      this.$emit("selectedSourceId", source.id);
      this.selectedSourceId = source.id;
    },
    async loadElectronCaptures() {
      const getCaptureSources = electronBridge?.getCaptureSources;
      if (!getCaptureSources) return;
      this.electronSources = await getCaptureSources();
    },
  },
});
</script>

<style scoped>
.electron-sources {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  overflow: auto;
  margin-top: 10px;
  margin-bottom: 5px;
}
</style>
