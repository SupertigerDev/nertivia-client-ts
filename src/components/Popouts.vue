<template>
  <div class="popouts">
    <component
      v-if="popup.component"
      :is="popup.component"
      :data="popup.data"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { PopoutModule } from "@/store/modules/popout";

const ProfilePopout = () =>
  import(
    /* webpackChunkName: "ProfilePopout" */ "@/components/ProfilePopout.vue"
  );
const MiniProfilePopout = () =>
  import(
    /* webpackChunkName: "MiniProfilePopout" */ "@/components/MiniProfilePopout.vue"
  );

@Component({ components: { ProfilePopout, MiniProfilePopout } })
export default class MainApp extends Vue {
  get popup() {
    return PopoutModule.popout;
  }
}
</script>

<style lang="scss" scoped>
.popouts {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 999999999999;
}
</style>
