<template>
  <div class="startup-options">
    <div class="box">
      <div class="description">
        <div class="material-icons">info</div>
        Desktop App Startup Options
      </div>
      <div class="warn" v-if="!$isElectron">
        To modify these settings, you must download the Nertivia desktop app.
      </div>
      <div :class="{ disabled: !$isElectron }">
        <CheckBox
          v-model="autoLaunch"
          name="Open Nertivia On Startup"
          class="check-box"
          @change="toggleStartup"
        />
        <CheckBox
          v-if="autoLaunch"
          v-model="launchMinimized"
          class="check-box"
          name="Start Minimized"
          @change="toggleLaunchMinimized"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import CheckBox from "@/components/CheckBox.vue";

import electronBridge from "@/utils/electronBridge";

@Component({ components: { CheckBox } })
export default class StartupOptions extends Vue {
  autoLaunch = false;
  launchMinimized = false;
  async mounted() {
    this.autoLaunch = await electronBridge?.invoke(
      "get_store_value",
      "startup.enabled",
      true
    );
    this.launchMinimized = await electronBridge?.invoke(
      "get_store_value",
      "startup.minimized",
      true
    );
  }
  toggleStartup(state: boolean) {
    this.autoLaunch = state;
    electronBridge?.invoke("set_store_value", "startup.enabled", state);
  }
  toggleLaunchMinimized(state: boolean) {
    this.launchMinimized = state;
    electronBridge?.invoke("set_store_value", "startup.minimized", state);
  }
}
</script>

<style lang="scss" scoped>
.startup-options {
  display: flex;
  flex-direction: column;
}
.description {
  display: flex;
  align-items: center;
  align-content: center;
  .material-icons {
    margin-right: 5px;
  }
  margin-bottom: 10px;
}
.title {
  margin-bottom: 5px;
}
.box {
  padding: 10px;
  align-self: flex-start;
}
.check-box {
  margin-bottom: 10px;
}
.disabled {
  opacity: 0.4;
  position: relative;
  &:before {
    content: "";
    cursor: not-allowed;
    position: absolute;
    left: 0;
    bottom: 0;
    top: 0;
    right: 0;
    z-index: 99999;
  }
}
.warn {
  border: solid 1px var(--warn-color);
  padding: 5px;
  border-radius: 4px;
  max-width: 600px;
  margin-bottom: 10px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
}
</style>
