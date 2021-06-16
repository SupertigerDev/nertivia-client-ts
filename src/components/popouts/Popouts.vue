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
import FloatingProfileCard from "./FloatingProfileCard.vue";

const components = {
  ProfilePopout: () =>
    import(
      /* webpackChunkName: "ProfilePopout" */ "@/components/popouts/profile-popout/ProfilePopout.vue"
    ),
  EditRolesPopout: () =>
    import(
      /* webpackChunkName: "EditRolesPopout" */ "@/components/popouts/EditRolesPopout.vue"
    ),
  MiniProfilePopout: () =>
    import(
      /* webpackChunkName: "MiniProfilePopout" */ "@/components/popouts/MiniProfilePopout.vue"
    ),

  StatusListContext: () =>
    import(
      /* webpackChunkName: "StatusListContext" */ "@/components/popouts/StatusListContext.vue"
    ),
  MessageContextMenu: () =>
    import(
      /* webpackChunkName: "MessageContextMenu" */ "@/components/popouts/MessageContextMenu.vue"
    ),
  UserContextMenu: () =>
    import(
      /* webpackChunkName: "UserContextMenu" */ "@/components/popouts/UserContextMenu.vue"
    ),
  ServerContextMenu: () =>
    import(
      /* webpackChunkName: "ServerContextMenu" */ "@/components/popouts/ServerContextMenu.vue"
    ),
  ChannelContextMenu: () =>
    import(
      /* webpackChunkName: "ServerContextMenu" */ "@/components/popouts/ChannelContextMenu.vue"
    ),
  BanOrKickUserPopout: () =>
    import(
      /* webpackChunkName: "BanOrKickUserPopout" */ "@/components/popouts/BanOrKickUserPopout.vue"
    ),
  DeleteMessagePopout: () =>
    import(
      /* webpackChunkName: "DeleteMessagePopout" */ "@/components/popouts/DeleteMessagePopout.vue"
    ),
  AddFriendPopout: () =>
    import(
      /* webpackChunkName: "AddFriendPopout" */ "@/components/popouts/AddFriendPopout.vue"
    ),
  AddServerPopout: () =>
    import(
      /* webpackChunkName: "AddServerPopout" */ "@/components/popouts/add-server-popout/AddServerPopout.vue"
    ),
  DragDropPopout: () =>
    import(
      /* webpackChunkName: "DragDropPopout" */ "@/components/popouts/DragDropPopout.vue"
    ),
  ImagePreviewPopout: () =>
    import(
      /* webpackChunkName: "ImagePreviewPopout" */ "@/components/popouts/ImagePreviewPopout.vue"
    ),
  GenericPopout: () =>
    import(
      /* webpackChunkName: "GenericPopout" */ "@/components/popouts/GenericPopout.vue"
    ),
  OpenLinkConfirm: () =>
    import(
      /* webpackChunkName: "OpenLinkConfirm" */ "@/components/popouts/OpenLinkConfirm.vue"
    ),
  UpdatePopout: () =>
    import(
      /* webpackChunkName: "UpdatePopout" */ "@/components/popouts/UpdatePopout.vue"
    ),
  ChangelogPopout: () =>
    import(
      /* webpackChunkName: "ChangelogPopout" */ "@/components/popouts/ChangelogPopout.vue"
    ),
  LinkGoogleDrive: () =>
    import(
      /* webpackChunkName: "LinkGoogleDrive" */ "@/components/popouts/LinkGoogleDrive.vue"
    ),
  ChangesToPolicies: () =>
    import(
      /* webpackChunkName: "ChangesToPolicies" */ "@/components/popouts/ChangesToPolicies.vue"
    ),
  FloatingProfileCard: () =>
    import(
      /* webpackChunkName: "FloatingProfileCard" */ "@/components/popouts/FloatingProfileCard.vue"
    ),
  AdminSuspendUser: () =>
    import(
      /* webpackChunkName: "AdminSuspendUser" */ "@/components/popouts/admin-popouts/SuspendUser.vue"
    ),
  AdminUnsuspendUser: () =>
    import(
      /* webpackChunkName: "AdminUnsuspendUser" */ "@/components/popouts/admin-popouts/UnsuspendUser.vue"
    ),
  MessageReactionEmojiPicker: () =>
    import(
      /* webpackChunkName: "MessageReactionEmojiPicker" */ "@/components/popouts/MessageReactionEmojiPicker.vue"
    ),
  ReactedUsersPreview: () =>
    import(
      /* webpackChunkName: "ReactedUsersPreview" */ "@/components/popouts/ReactedUsersPreview.vue"
    )
};

@Component({
  components
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
