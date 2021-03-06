<template>
  <div class="window-controls">
    <div class="drag-area">
      <div class="title">Nertivia</div>
    </div>
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
  width: 100%;
  height: 30px;
  background: rgba(0, 0, 0, 0.4);
  overflow: hidden;
}
.drag-area {
  display: flex;
  align-items: center;
  height: 100%;
  width: 100%;
  -webkit-user-select: none;
  -webkit-app-region: drag;
  margin-top: 3px;
  margin-left: 3px;
  margin-right: 3px;
}
.title {
  margin-left: 5px;
  margin-bottom: 3px;
}
</style>
