<template>
  <div class="popout-background">
    <div class="add-server-popout">
      <div class="content animate-in">
        <div class="header">
          <div class="icon material-icons">dns</div>
          <div class="text">Welcome to Nertivia!</div>
        </div>
        <LoadingScreen v-if="!connected"/>
        <div class="container" v-show="connected">
          <SetProfile />
        </div>
        <div class="footer">
          <Button :alert="true" name="Close" @click="close" />
          <div class="nav-buttons">
            <Button :alert="true" name="Back" />
            <Button name="Next" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { PopoutsModule } from "@/store/modules/popouts";
import LoadingScreen from "@/components/LoadingScreen.vue";
import SetProfile from "./SetProfile.vue";

import Button from "@/components/CustomButton.vue";
import { defineComponent } from "vue";
import { MeModule } from "@/store/modules/me";
export default defineComponent({
  name: "Welcome",
  components: { Button, SetProfile, LoadingScreen },
  props: {
    identity: { required: true, type: String }
  },
  computed: {
    connected() {
      return MeModule.connected;
    }
  },
  methods: {
    close() {
      PopoutsModule.ClosePopout(this.identity);
    }
  }
});
</script>
<style lang="scss" scoped>
.add-server-popout {
  background: var(--popout-color);
  border-radius: 4px;
  overflow: hidden;
  max-width: 700px;
  width: 100%;
  height: 500px;
}
.footer {
  display: flex;
  .nav-buttons {
    display: flex;
    margin-left: auto;
  }
}
.animate-in {
  opacity: 0;
  animation: showUp 0.2s;
  animation-fill-mode: forwards;
}
@keyframes showUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.popout-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.658);
  z-index: 99999999999999999999999999999;
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: center;
  pointer-events: all;
}
.header {
  display: flex;
  align-items: center;
  align-content: center;
  padding: 5px;
  background: var(--main-header-bg-color);
  .text {
    margin-left: 4px;
  }
}
.content {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.inner-content {
  display: flex;
  flex-direction: column;
  overflow: auto;
  height: 100%;
}

.container {
  height: 100%;
  margin-top: 0;
  background: rgba(255, 255, 255, 0.1);
  padding: 5px;
  overflow: hidden;
  position: relative;
}
</style>
