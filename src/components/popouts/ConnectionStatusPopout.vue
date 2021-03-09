<template>
  <div class="status-popout">
    {{ connectionMessage }}
  </div>
</template>

<script lang="ts">
import { MeModule } from "@/store/modules/me";
import { Component, Vue, Watch } from "vue-property-decorator";

@Component
export default class MainApp extends Vue {
  get isConnected() {
    return MeModule.connected;
  }
  mounted() {
    this.closePopout();
  }
  @Watch("isConnected")
  closePopout() {
    setTimeout(() => {
      if (!this.isConnected) return;
      this.$emit("close");
    }, 3000);
  }
  get connectionMessage() {
    if (this.isConnected && !MeModule.connectionMessage) {
      return "Ready!";
    }
    return MeModule.connectionMessage;
  }
}
</script>

<style lang="scss" scoped>
.status-popout {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 20px;
  border-radius: 4px;
  left: calc(50% - 100px);
  height: 40px;
  width: 200px;
  z-index: 9999999;
  box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.5);
  background: rgba(0, 0, 0, 0.7);
}
</style>
