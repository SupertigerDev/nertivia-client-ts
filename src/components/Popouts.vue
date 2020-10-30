<template>
  <div class="popouts">
    <component
      v-for="(popup, id) in popups"
      :key="id"
      :is="popup.component"
      :data="popup.data"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { PopoutsModule } from "@/store/modules/popouts";

const ProfilePopout = () =>
  import(
    /* webpackChunkName: "ProfilePopout" */ "@/components/ProfilePopout.vue"
  );
const MiniProfilePopout = () =>
  import(
    /* webpackChunkName: "MiniProfilePopout" */ "@/components/MiniProfilePopout.vue"
  );

const StatusListContext = () =>
  import(
    /* webpackChunkName: "StatusListContext" */ "@/components/dashboard-area/StatusListContext.vue"
  );
const MessageContextMenu = () =>
  import(
    /* webpackChunkName: "MessageContextMenu" */ "@/components/chat-area/message/MessageContextMenu.vue"
  );
@Component({
  components: {
    ProfilePopout,
    MiniProfilePopout,
    StatusListContext,
    MessageContextMenu
  }
})
export default class MainApp extends Vue {
  get popups() {
    return PopoutsModule.popouts;
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
