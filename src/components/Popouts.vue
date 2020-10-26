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

@Component({ components: { ProfilePopout } })
export default class MainApp extends Vue {
  get popup() {
    return PopoutModule.popout;
  }
}
</script>
