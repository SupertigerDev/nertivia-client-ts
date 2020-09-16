<template>
  <div class="side-bar">
    <Servers />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Servers from "./Servers.vue";

@Component({ components: { Servers } })
export default class MainApp extends Vue {}
</script>

<style lang="scss" scoped>
.side-bar {
  display: flex;
  flex-direction: column;
  width: 70px;
}
</style>
