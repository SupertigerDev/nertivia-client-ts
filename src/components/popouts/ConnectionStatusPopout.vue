<template>
  <div class="status-popout">
    {{ connectionMessage }}
  </div>
</template>

<script lang="ts">
import { MeModule } from "@/store/modules/me";
import { PopoutsModule } from "@/store/modules/popouts";
import Vue from "vue";
export default Vue.extend({
  name: "MainApp",
  computed: {
    isConnected(): any {
      return MeModule.connected;
    },
    connectionMessage(): any {
      if (this.isConnected && !MeModule.connectionMessage) {
        return this.$t("connection.ready");
      }
      return MeModule.connectionMessage;
    }
  },
  watch: {
    isConnected: {
      // @ts-ignore
      handler: "closePopout"
    },
    connectionMessage: {
      // @ts-ignore
      handler: "onConnectionMessage"
    }
  },
  mounted() {
    this.closePopout();
  },
  methods: {
    closePopout() {
      setTimeout(() => {
        if (!this.isConnected) return;
        this.$emit("close");
      }, 3000);
    },
    onConnectionMessage(message) {
      if (message === "terms_not_agreed") {
        PopoutsModule.ShowPopout({
          id: "changes-policy-popout",
          component: "ChangesToPolicies"
        });
      }
    }
  }
});
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
