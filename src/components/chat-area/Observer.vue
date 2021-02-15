<template>
  <div class="observer" :class="{ debug }"></div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class Observer extends Vue {
  @Prop() private debug!: boolean;
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
<style scoped>
.debug {
  background: rgba(255, 76, 76, 0.123);
}
</style>
