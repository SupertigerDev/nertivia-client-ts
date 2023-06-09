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
import { PopoutsModule } from "@/store/modules/popouts";
import { defineComponent, defineAsyncComponent } from "vue";

const components = {
  ProfilePopout: defineAsyncComponent(
    () => import("@/components/popouts/profile-popout/ProfilePopout.vue")
  ),
  MarkupGuide: defineAsyncComponent(
    () => import("@/components/popouts/markup-guide/MarkupGuide.vue")
  ),
  EditRolesPopout: defineAsyncComponent(
    () => import("@/components/popouts/EditRolesPopout.vue")
  ),
  MiniProfilePopout: defineAsyncComponent(
    () => import("@/components/popouts/MiniProfilePopout.vue")
  ),

  StatusListContext: defineAsyncComponent(
    () => import("@/components/popouts/StatusListContext.vue")
  ),
  MessageContextMenu: defineAsyncComponent(
    () => import("@/components/popouts/MessageContextMenu.vue")
  ),
  UserContextMenu: defineAsyncComponent(
    () => import("@/components/popouts/UserContextMenu.vue")
  ),
  ServerContextMenu: defineAsyncComponent(
    () => import("@/components/popouts/ServerContextMenu.vue")
  ),
  TabContextMenu: defineAsyncComponent(
    () => import("@/components/popouts/TabContextMenu.vue")
  ),
  ChannelContextMenu: defineAsyncComponent(
    () => import("@/components/popouts/ChannelContextMenu.vue")
  ),
  ImageContextMenu: defineAsyncComponent(
    () => import("@/components/popouts/ImageContextMenu.vue")
  ),
  BanOrKickUserPopout: defineAsyncComponent(
    () => import("@/components/popouts/BanOrKickUserPopout.vue")
  ),
  LeaveServerConfirmPopout: defineAsyncComponent(
    () => import("@/components/popouts/LeaveServerConfirmPopout.vue")
  ),
  DeleteMessagePopout: defineAsyncComponent(
    () => import("@/components/popouts/DeleteMessagePopout.vue")
  ),
  AddFriendPopout: defineAsyncComponent(
    () => import("@/components/popouts/AddFriendPopout.vue")
  ),
  AddServerPopout: defineAsyncComponent(
    () => import("@/components/popouts/add-server-popout/AddServerPopout.vue")
  ),
  DragDropPopout: defineAsyncComponent(
    () => import("@/components/popouts/DragDropPopout.vue")
  ),
  ImagePreviewPopout: defineAsyncComponent(
    () => import("@/components/popouts/ImagePreviewPopout.vue")
  ),
  GenericPopout: defineAsyncComponent(
    () => import("@/components/popouts/GenericPopout.vue")
  ),
  OpenLinkConfirm: defineAsyncComponent(
    () => import("@/components/popouts/OpenLinkConfirm.vue")
  ),
  UpdatePopout: defineAsyncComponent(
    () => import("@/components/popouts/UpdatePopout.vue")
  ),
  DiscontinuedPopout: defineAsyncComponent(
    () => import("@/components/popouts/DiscontinuedPopout.vue")
  ),
  ChangelogPopout: defineAsyncComponent(
    () => import("@/components/popouts/ChangelogPopout.vue")
  ),
  LinkGoogleDrive: defineAsyncComponent(
    () => import("@/components/popouts/LinkGoogleDrive.vue")
  ),
  ChangesToPolicies: defineAsyncComponent(
    () => import("@/components/popouts/ChangesToPolicies.vue")
  ),
  FloatingProfileCard: defineAsyncComponent(
    () => import("@/components/popouts/FloatingProfileCard.vue")
  ),
  AdminSuspendUser: defineAsyncComponent(
    () => import("@/components/popouts/admin-popouts/SuspendUser.vue")
  ),
  AdminUnsuspendUser: defineAsyncComponent(
    () => import("@/components/popouts/admin-popouts/UnsuspendUser.vue")
  ),
  MessageReactionEmojiPicker: defineAsyncComponent(
    () => import("@/components/popouts/MessageReactionEmojiPicker.vue")
  ),
  ReactedUsersPreview: defineAsyncComponent(
    () => import("@/components/popouts/ReactedUsersPreview.vue")
  ),
  Welcome: defineAsyncComponent(
    () => import("@/components/popouts/welcome-popout/Welcome.vue")
  ),
  ScreensharePopout: defineAsyncComponent(
    () =>
      import("@/components/popouts/screenshare-popout/ScreensharePopout.vue")
  ),
  CaptchaPopout: defineAsyncComponent(
    () => import("@/components/popouts/CaptchaPopout.vue")
  ),
  DeleteMessageBatchPopout: defineAsyncComponent(
    () => import("@/components/popouts/DeleteMessageBatchPopout.vue")
  ),
};
export default defineComponent({
  name: "MainApp",
  components,
  computed: {
    popups(): any {
      return PopoutsModule.popouts;
    },
  },
});
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
