<template>
  <div class="selected-user-page">
    <CustomButton name="Back" icon="arrow_back" @click="$emit('back')" />
    <div class="banner-profile" :class="{ banner: bannerURL }">
      <img v-if="bannerURL" :src="bannerURL" alt="" />
      <UserTemplate class="user-template" :user="user" />
    </div>
    <div class="actions">
      <CustomButton name="Remove Avatar" :alert="true" icon="delete" />
      <CustomButton name="Remove Banner" :alert="true" icon="delete" />
    </div>
    <div class="more-details">
      <div class="item" v-for="item in items" :key="item.name">
        <CustomInput
          :prefixIcon="item.icon"
          :disabled="true"
          :title="item.name"
          :value="item.value"
        />
      </div>
    </div>
    <div class="actions">
      <CustomButton @click="viewProfile" name="View Profile" icon="person" />
      <CustomButton name="Edit User" icon="edit" />
      <CustomButton
        @click="openSuspendPopout"
        name="Suspend User"
        :alert="true"
        icon="block"
        v-if="!user.banned"
      />
      <CustomButton
        @click="openUnsuspendPopout"
        name="Unsuspend User"
        :alert="true"
        icon="undo"
        v-if="user.banned"
      />
    </div>
    <div class="main-title">Accounts created with same IP:</div>
  </div>
</template>

<script lang="ts">
import { ExpandedUser } from "@/services/adminService";
import { Vue, Component, Prop } from "vue-property-decorator";
import UserTemplate from "./UserTemplate.vue";
import CustomButton from "@/components/CustomButton.vue";
import CustomInput from "@/components/CustomInput.vue";
import { PopoutsModule } from "@/store/modules/popouts";

@Component({ components: { UserTemplate, CustomButton, CustomInput } })
export default class SelectedUserPage extends Vue {
  @Prop() private user!: ExpandedUser;
  get items() {
    return [
      {
        name: "Email",
        icon: "alternate_email",
        value: this.user.email
      },
      {
        name: "User ID",
        icon: "perm_identity",
        value: this.user.id
      },
      {
        name: "User IP",
        icon: "dns",
        value: this.user.ip
      }
    ];
  }
  openSuspendPopout() {
    PopoutsModule.ShowPopout({
      id: "admin-suspend-user-popout",
      component: "AdminSuspendUser",
      data: { user: this.user, callback: this.suspendCallback }
    });
  }
  openUnsuspendPopout() {
    PopoutsModule.ShowPopout({
      id: "admin-unsuspend-user-popout",
      component: "AdminUnsuspendUser",
      data: { user: this.user, callback: this.unsuspendCallback }
    });
  }
  viewProfile() {
    PopoutsModule.ShowPopout({
      id: "profile",
      component: "profile-popout",
      data: { id: this.user?.id }
    });
  }
  suspendCallback() {
    this.$emit("suspended");
  }
  unsuspendCallback(removeIPBan: boolean) {
    this.$emit("unsuspend", { removeIPBan });
  }
  get bannerURL() {
    if (!this.user.banner) return null;
    return process.env.VUE_APP_NERTIVIA_CDN + this.user.banner;
  }
}
</script>

<style lang="scss" scoped>
.banner-profile {
  position: relative;
  border-radius: 4px;
  overflow: hidden;
  margin: 10px;
  &.banner {
    height: 200px;
    width: 400px;
    .user-template {
      position: absolute;
      bottom: 0;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(10px);
      right: 0;
      left: 0;
      z-index: 99999999999;
    }
  }
  img {
    position: absolute;
    height: 100%;
    width: 100%;
    object-fit: cover;
  }
}

.selected-user-page {
  padding: 5px;
}
.actions {
  display: flex;
  margin: 5px;
}
.item {
  margin-bottom: -10px;
}
.more-details {
  margin-left: 10px;
}
.main-title {
  margin-left: 10px;
  opacity: 0.8;
}
</style>
