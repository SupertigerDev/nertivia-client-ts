<template>
  <div class="observer"></div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Observer extends Vue {
  observer: IntersectionObserver | null = null;
  intersecting = false;
  mounted() {
    this.observer = new IntersectionObserver(this.onObserved, {});
    this.observer.observe(this.$el);
  }
  onObserved(entries: IntersectionObserverEntry[]) {
    this.intersecting = entries[0].isIntersecting;
    this.$emit("intersecting", entries[0].isIntersecting);
  }
  beforeDestroy() {
    this.observer?.disconnect();
  }
}
</script>
