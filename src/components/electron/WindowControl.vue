<template>
  <div class="window-controls">
    <div class="drag-area">
      <img class="logo" src="@/assets/logo.svg" />
      <div class="title">Nertivia</div>
    </div>
    <div class="buttons">
      <div class="button material-icons" @click="minimize">minimize</div>
      <div class="button material-icons" @click="maximize">stop</div>
      <div class="button material-icons warn" @click="close">close</div>
    </div>
  </div>
</template>

<script lang="ts">
import electronBridge from "@/utils/electronBridge";
import Vue from "vue";
export default Vue.extend({
  name: "App",
  methods: {
    minimize() {
      electronBridge?.send("window_action", "minimize");
    },
    maximize() {
      electronBridge?.send("window_action", "maximize");
    },
    close() {
      electronBridge?.send("window_action", "close");
    }
  }
});
</script>

<style scoped lang="scss">
.window-controls {
  display: flex;
  flex-shrink: 0;
  width: 100%;
  height: 30px;
  background: rgba(0, 0, 0, 0.4);
  overflow: hidden;
  user-select: none;
}
.drag-area {
  display: flex;
  align-items: center;
  height: 100%;
  flex: 1;
  -webkit-user-select: none;
  -webkit-app-region: drag;
  margin-top: 3px;
  margin-left: 3px;
  margin-right: 3px;
}
.title {
  margin-left: 5px;
  margin-bottom: 3px;
  color: rgba(255, 255, 255, 0.6);
}
.buttons {
  display: flex;
  overflow: hidden;
  align-self: center;
  margin-right: 2px;
}
.button {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  width: 50px;
  height: 27px;
  margin-left: 2px;
  border-radius: 4px;
  transition: 0.2s;
  user-select: none;
  margin-bottom: 1px;
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);
  &:hover {
    color: white;
    background: var(--primary-color);
    &.warn {
      background: var(--alert-color);
    }
  }
}
.logo {
  height: 25px;
  width: 25px;
  margin-bottom: 4px;
  margin-left: 2px;
}
</style>
