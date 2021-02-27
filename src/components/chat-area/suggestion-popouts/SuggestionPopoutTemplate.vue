<template>
  <div class="suggestion">
    <div class="content animate-in">
      <component
        :is="template"
        v-for="(item, i) in items"
        :key="i"
        :item="item"
        :selected="i === selectedIndex"
        @mouseover.native="selectedIndex = i"
        @click.native="enter"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

@Component
export default class SuggestionPopoutTemplate extends Vue {
  selectedIndex = 0;
  @Prop() private items!: any[];
  @Prop() private template!: any;

  up() {
    if (this.selectedIndex === 0) {
      this.selectedIndex = this.items.length - 1;
      return;
    }
    this.selectedIndex -= 1;
  }
  down() {
    if (this.selectedIndex === this.items.length - 1) {
      this.selectedIndex = 0;
      return;
    }
    this.selectedIndex += 1;
  }
  enter() {
    this.$emit("selected", this.items[this.selectedIndex]);
  }
  @Watch("items")
  onItemChange() {
    this.selectedIndex = 0;
  }
}
</script>

<style scoped>
.suggestion {
  background: var(--card-color);
  border-radius: 4px;
  border: solid 1px rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  /* padding: 5px; */
  overflow: hidden;
}
.animate-in {
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
</style>
