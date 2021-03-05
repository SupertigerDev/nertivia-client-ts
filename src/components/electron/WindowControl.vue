<template>
  <div class="window-controls">
    <div class="title">Nertivia</div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class App extends Vue {}
</script>

<style lang="scss">
.window-controls {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  width: 100%;
  height: 30px; 
  background: rgba(0, 0, 0, 0.4);
  -webkit-user-select: none;
  -webkit-app-region: drag;
  border-bottom-right-radius: 4px;
  border-bottom-left-radius: 4px;
}
.title {
  margin-left: 5px;
}
</style>
