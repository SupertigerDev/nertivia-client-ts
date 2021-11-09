<template>
  <div v-click-outside="backgroundClick" class="gif-panel">
    <div class="gif-panel-inner">
      <input
        type="text"
        class="input"
        ref="search"
        placeholder="Search"
        v-model="search"
      />
    </div>
  </div>
</template>

<script lang="ts">
import VirtualList from "@supertiger/vue-3-virtual-scroll-list";
import { defineComponent } from "vue";

export default defineComponent({
  props: ["inputElement"],
  emits: ["click", "close"],
  data() {
    return {
      search: "",
    };
  },
  mounted() {
    if (!this.$isMobile) {
      (this.$refs.search as any).focus();
    }
  },
  methods: {
    close() {
      this.$emit("close");
    },
    backgroundClick(event) {
      if (!event.target.closest(".gif-button")) this.close();
    },
  },
});
</script>

<style scoped lang="scss">
.gif-panel {
  display: flex;
  flex-direction: column;
  position: absolute;
  bottom: 10px;
  right: 10px;
  z-index: 111111111111111;
}

.gif-panel-inner {
  display: flex;
  flex-direction: column;
  background: var(--card-color);
  border-radius: 4px;
  border: solid 1px rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.5);
  transition: 0.3s;
  z-index: 99999;
  height: 352px;
  width: 375px;
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
