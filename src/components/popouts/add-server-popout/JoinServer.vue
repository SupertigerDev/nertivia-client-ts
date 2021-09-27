<template>
  <div class="join-server">
    <transition :name="server ? 'slide-left' : 'slide-right'">
      <component
        :is="server ? 'ServerPreview' : 'EnterServerCode'"
        @success="server = $event"
        :server="server"
        @back="server = null"
      ></component>
    </transition>
  </div>
</template>
<script lang="ts">
import EnterServerCode from "./EnterServerCode.vue";
import ServerPreview from "./ServerPreview.vue";

import { defineComponent } from "vue";
export default defineComponent({
  name: "JoinServer",
  components: { EnterServerCode, ServerPreview },
  data() {
    return {
      server: null as any,
    };
  },
});
</script>

<style lang="scss" scoped>
.slide-left-leave-active,
.slide-left-enter-active {
  transition: 0.3s;
}
.slide-left-enter-from {
  transform: translate(100%, 0);
}
.slide-left-leave-to {
  transform: translate(-100%, 0);
}
.slide-right-leave-active,
.slide-right-enter-active {
  transition: 0.3s;
}
.slide-right-enter-from {
  transform: translate(-100%, 0);
}
.slide-right-leave-to {
  transform: translate(100%, 0);
}

.join-server {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  margin: 10px;
  display: flex;
  flex-direction: column;
}
</style>
