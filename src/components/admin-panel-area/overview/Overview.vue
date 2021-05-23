<template>
  <div class="Overview">
    <Stats />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import Stats from "./Stats.vue";

@Component({ components: { Stats } })
export default class Overview extends Vue {}
</script>

<style lang="scss"></style>
