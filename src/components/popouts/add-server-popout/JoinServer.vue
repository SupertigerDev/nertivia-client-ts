<template>
  <div class="join-server">
    <transition :name="server ? 'slide-left' : 'slide-right'">
      <EnterServerCode
        v-if="!server"
        key="EnterServerCode"
        @success="server = $event"
      />
      <ServerPreview
        v-if="server"
        key="ServerPreview"
        :server="server"
        @back="server = null"
      />
    </transition>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import EnterServerCode from "./EnterServerCode.vue";
import ServerPreview from "./ServerPreview.vue";

@Component({ components: { EnterServerCode, ServerPreview } })
export default class JoinServer extends Vue {
  server: any = null;
}
</script>

<style lang="scss" scoped>
.slide-left-leave-active,
.slide-left-enter-active {
  transition: 0.3s;
}
.slide-left-enter {
  transform: translate(100%, 0);
}
.slide-left-leave-to {
  transform: translate(-100%, 0);
}
.slide-right-leave-active,
.slide-right-enter-active {
  transition: 0.3s;
}
.slide-right-enter {
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
