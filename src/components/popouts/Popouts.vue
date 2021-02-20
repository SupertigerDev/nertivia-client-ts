<template>
  <div class="popouts">
    <component
      v-for="(popup, id) in popups"
      :key="popup.key || id"
      :is="popup.component"
      :data="popup.data"
      :identity="id"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { PopoutsModule } from "@/store/modules/popouts";

const ProfilePopout = () =>
  import(
    /* webpackChunkName: "ProfilePopout" */ "@/components/popouts/ProfilePopout.vue"
  );
const EditRolesPopout = () =>
  import(
    /* webpackChunkName: "EditRolesPopout" */ "@/components/popouts/EditRolesPopout.vue"
  );
const MiniProfilePopout = () =>
  import(
    /* webpackChunkName: "MiniProfilePopout" */ "@/components/popouts/MiniProfilePopout.vue"
  );

const StatusListContext = () =>
  import(
    /* webpackChunkName: "StatusListContext" */ "@/components/popouts/StatusListContext.vue"
  );
const MessageContextMenu = () =>
  import(
    /* webpackChunkName: "MessageContextMenu" */ "@/components/popouts/MessageContextMenu.vue"
  );
const UserContextMenu = () =>
  import(
    /* webpackChunkName: "UserContextMenu" */ "@/components/popouts/UserContextMenu.vue"
  );
const ServerContextMenu = () =>
  import(
    /* webpackChunkName: "ServerContextMenu" */ "@/components/popouts/ServerContextMenu.vue"
  );
const ChannelContextMenu = () =>
  import(
    /* webpackChunkName: "ServerContextMenu" */ "@/components/popouts/ChannelContextMenu.vue"
  );
const BanOrKickUserPopout = () =>
  import(
    /* webpackChunkName: "BanOrKickUserPopout" */ "@/components/popouts/BanOrKickUserPopout.vue"
  );
const DeleteMessagePopout = () =>
  import(
    /* webpackChunkName: "DeleteMessagePopout" */ "@/components/popouts/DeleteMessagePopout.vue"
  );
const AddFriendPopout = () =>
  import(
    /* webpackChunkName: "AddFriendPopout" */ "@/components/popouts/AddFriendPopout.vue"
  );
const AddServerPopout = () =>
  import(
    /* webpackChunkName: "AddServerPopout" */ "@/components/popouts/add-server-popout/AddServerPopout.vue"
  );
const DragDropPopout = () =>
  import(
    /* webpackChunkName: "DragDropPopout" */ "@/components/popouts/DragDropPopout.vue"
  );
const ImagePreviewPopout = () =>
  import(
    /* webpackChunkName: "ImagePreviewPopout" */ "@/components/popouts/ImagePreviewPopout.vue"
  );
const GenericPopout = () =>
  import(
    /* webpackChunkName: "GenericPopout" */ "@/components/popouts/GenericPopout.vue"
  );
@Component({
  components: {
    ProfilePopout,
    MiniProfilePopout,
    StatusListContext,
    MessageContextMenu,
    UserContextMenu,
    EditRolesPopout,
    BanOrKickUserPopout,
    ServerContextMenu,
    DragDropPopout,
    DeleteMessagePopout,
    ImagePreviewPopout,
    AddFriendPopout,
    AddServerPopout,
    ChannelContextMenu,
    GenericPopout
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
