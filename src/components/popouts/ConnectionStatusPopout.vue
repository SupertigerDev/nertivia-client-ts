<template>
  <div class="status-popout">
    {{ connectionMessage }}
  </div>
</template>

<script lang="ts">
import { MeModule } from "@/store/modules/me";
import { PopoutsModule } from "@/store/modules/popouts";
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
  @Watch("connectionMessage")
  onConnectionMessage(message) {
    if (message === "terms_not_agreed") {
      PopoutsModule.ShowPopout({
        id: "changes-policy-popout",
        component: "ChangesToPolicies"
      });
    }
  }
  get connectionMessage() {
    if (this.isConnected && !MeModule.connectionMessage) {
      return this.$t("connection.ready");
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
