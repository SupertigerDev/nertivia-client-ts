<template>
  <div class="interface">
    <InformationTemplate class="desc" :title="$t('settings.account.title')" />
    <div class="box">
      <div class="error" v-if="errors['other']">{{ errors["other"] }}</div>

      <div class="avatar-banner" :class="{ noBanner: !bannerImageUrl }">
        <div class="banner-container">
          <img class="banner" v-if="bannerImageUrl" :src="bannerImageUrl" />
          <div
            title="Edit Banner"
            class="material-icons edit-button banner-edit"
            @click="$refs.bannerInput.click()"
          >
            edit
          </div>
        </div>
        <div class="avatar-container">
          <AvatarImage
            class="avatar"
            :imageId="me.avatar"
            :seedId="me.id"
            :animateGif="true"
            :customUrl="newAvatar"
            size="80px"
          />
          <div
            class="material-icons edit-button avatar-edit"
            title="Edit Avatar"
            @click="$refs.avatarInput.click()"
          >
            edit
          </div>
        </div>

        <input
          ref="bannerInput"
          style="display: none"
          type="file"
          @change="bannerChange"
          accept=".jpeg, .jpg, .png, .gif"
        />
        <input
          ref="avatarInput"
          style="display: none"
          type="file"
          @change="avatarChange"
          accept=".jpeg, .jpg, .png, .gif"
        />
      </div>

      <CustomInput
        title="Email"
        v-model="email"
        prefixIcon="alternate_email"
        :error="errors['email']"
      />
      <div class="user-tag">
        <CustomInput
          title="Username"
          v-model="username"
          class="username"
          :error="errors['username'] || errors['tag']"
          prefixIcon="account_box"
          :connectRight="true"
        />
        <CustomInput
          class="tag"
          title="Tag"
          :error="errors['tag'] ? ' ' : undefined"
          v-model="tag"
          prefixIcon="local_offer"
          :connectLeft="true"
        />
      </div>
      <CustomInput
        title="Password"
        :error="errors['password']"
        v-model="password"
        prefixIcon="lock"
        v-if="showPassword"
        type="password"
      />
      <div class="link" v-if="!showNewPassword" @click="showNewPassword = true">
        {{ $t("settings.account.change-password") }}
      </div>
      <CustomInput
        v-if="showNewPassword"
        title="New Password"
        :error="errors['new_password']"
        v-model="newPassword"
        prefixIcon="lock"
        type="password"
      />
      <CustomInput
        v-if="showNewPassword"
        title="Confirm New Password"
        v-model="newPasswordConfirm"
        :error="errors['confirm_new_password']"
        prefixIcon="lock"
        type="password"
      />
      <div class="link" @click="relinkButton">
        {{
          me.googleDriveLinked
            ? $t("settings.account.relink-google-drive")
            : $t("settings.account.link-google-drive")
        }}
      </div>
      <div class="link" @click="showWelcomePopout">Show Welcome Popout</div>
      <CustomButton
        :filled="true"
        :name="!requestSent ? $t('save-changes') : $t('saving')"
        icon="save"
        v-if="showSaveButton"
        @click="update"
      />
    </div>
    <HtmlProfile />
    <MoreProfile
      @update="moreProfileUpdate"
      v-if="aboutMe !== null"
      :aboutMe="aboutMe"
    />
  </div>
</template>

<script lang="ts">
import CustomInput from "@/components/CustomInput.vue";
import CustomButton from "@/components/CustomButton.vue";
import InformationTemplate from "@/components/InformationTemplate.vue";
import AvatarImage from "@/components/AvatarImage.vue";
import MoreProfile from "./MoreProfile.vue";
import HtmlProfile from "./HtmlProfile.vue";
import { MeModule } from "@/store/modules/me";
import {
  fetchUser,
  updateUser,
  UpdateUserRequest,
} from "@/services/userService";
import { updateInstance } from "@/services/wrapper";
import { PopoutsModule } from "@/store/modules/popouts";

import { defineComponent } from "vue";
export default defineComponent({
  name: "Account",
  components: {
    CustomInput,
    CustomButton,
    AvatarImage,
    InformationTemplate,
    HtmlProfile,
    MoreProfile,
  },
  data() {
    return {
      aboutMe: null as any,
      email: "",
      username: "",
      tag: "",
      password: "",
      showNewPassword: false,
      newPassword: "",
      newPasswordConfirm: "",
      newAvatar: null as string | null,
      newBanner: null as string | null,
      requestSent: false,
      errors: {} as any,
    };
  },
  computed: {
    bannerImageUrl(): any {
      if (this.newBanner) return this.newBanner;
      if (!this.me.banner) return null;
      return process.env.VUE_APP_NERTIVIA_CDN + this.me.banner;
    },
    me(): any {
      return MeModule.user;
    },
    isConnected(): any {
      return MeModule.connected;
    },
    showPassword(): any {
      const { emailChanged, usernameChanged, tagChanged, newPasswordChanged } =
        this.changedItems;

      const othersChanged =
        emailChanged || usernameChanged || tagChanged || newPasswordChanged;

      return othersChanged || this.showNewPassword;
    },
    showSaveButton(): any {
      const {
        emailChanged,
        usernameChanged,
        tagChanged,
        newPasswordChanged,
        avatarChanged,
        bannerChanged,
      } = this.changedItems;

      return (
        emailChanged ||
        usernameChanged ||
        tagChanged ||
        newPasswordChanged ||
        avatarChanged ||
        bannerChanged
      );
    },
    changedItems(): any {
      const me = this.me;
      const emailChanged = this.email !== me.email;
      const usernameChanged = this.username !== me.username;
      const tagChanged = this.tag !== me.tag;
      const newPasswordChanged = this.newPassword.length;
      const avatarChanged = this.newAvatar?.length || false;
      const bannerChanged = this.newBanner?.length || false;
      return {
        emailChanged,
        usernameChanged,
        tagChanged,
        newPasswordChanged,
        avatarChanged,
        bannerChanged,
      };
    },
  },
  watch: {
    isConnected: {
      handler: "onConnectionChange",
    },
  },
  mounted() {
    this.resetValues();
    this.moreProfileUpdate();
  },
  methods: {
    showWelcomePopout() {
      PopoutsModule.ShowPopout({
        id: "welcome",
        component: "Welcome",
        data: {},
      });
    },
    moreProfileUpdate() {
      if (!MeModule.user.id) return;
      fetchUser(MeModule.user.id).then((user) => {
        this.aboutMe = user.user.about_me;
      });
    },
    resetValues() {
      this.email = MeModule.user.email || "";
      this.username = MeModule.user.username || "";
      this.tag = MeModule.user.tag || "";
      this.password = "";
      this.showNewPassword = false;
      this.newPassword = "";
      this.newPasswordConfirm = "";
      this.newAvatar = null;
      this.newBanner = null;
    },
    avatarChange(event: any) {
      const file: File = event.target.files[0];
      event.target.value = "";
      if (!file) return;
      const reader = new FileReader();
      reader.onloadend = (event) => {
        this.newAvatar = (event.target?.result as any) || null;
      };
      reader.readAsDataURL(file);
    },
    bannerChange(event: any) {
      const file: File = event.target.files[0];
      event.target.value = "";
      if (!file) return;
      const reader = new FileReader();
      reader.onloadend = (event) => {
        this.newBanner = (event.target?.result as any) || null;
      };
      reader.readAsDataURL(file);
    },
    relinkButton() {
      PopoutsModule.ShowPopout({
        id: "link-google-drive",
        component: "LinkGoogleDrive",
      });
    },
    update() {
      if (this.requestSent) return;
      this.errors = {};
      this.requestSent = true;
      const data: UpdateUserRequest = {};

      this.changedItems.usernameChanged &&
        (data.username = this.username.trim());
      this.changedItems.tagChanged && (data.tag = this.tag.trim());
      this.password.trim().length && (data.password = this.password.trim());
      this.changedItems.newPasswordChanged &&
        (data.new_password = this.newPassword.trim());
      this.changedItems.emailChanged && (data.email = this.email.trim());
      this.changedItems.avatarChanged && (data.avatar = this.newAvatar || "");
      this.changedItems.bannerChanged && (data.banner = this.newBanner || "");

      if (!this.showPassword) delete data["password"];

      if (data.new_password && data.new_password !== this.newPasswordConfirm) {
        this.errors["confirm_new_password"] = "Passwords do not match!";
        this.requestSent = false;
        return;
      }

      updateUser(data, this.$socket.id)
        .then((res) => {
          if (res.token) {
            localStorage["hauthid"] = res.token;
            delete res.token;
            updateInstance();
          }
          MeModule.UpdateUser(res);
          this.resetValues();
          this.requestSent = false;
        })
        .catch(async (err) => {
          if (!err.response) {
            this.errors["other"] = this.$t(
              "could-not-connect-to-server"
            ).toString();
            this.requestSent = false;
            return;
          }
          const knownErrs = [
            "username",
            "tag",
            "password",
            "new_password",
            "email",
          ];
          const { errors, message } = await err.response.json();
          if (message) {
            this.errors["other"] = message;
            this.requestSent = false;
            return;
          }
          for (let i = 0; i < errors.length; i++) {
            const error = errors[i];
            if (!knownErrs.includes(error.param)) {
              this.errors["other"] = error.msg;
              continue;
            }
            this.errors[error.param] = error.msg;
          }
          this.requestSent = false;
        });
    },
    onConnectionChange(connected: boolean) {
      if (connected) this.resetValues();
    },
  },
});
</script>

<style lang="scss" scoped>
.interface {
  display: flex;
  flex-direction: column;
  overflow: auto;
  height: 100%;
}

.desc {
  margin-left: 10px;
  margin-top: 10px;
}

.title {
  margin-bottom: 5px;
}
.box {
  display: flex;
  flex-direction: column;
  padding: 10px;
  max-width: 500px;
  margin-left: 5px;
}
.user-tag {
  display: flex;
  .input {
    flex-shrink: initial;
  }
  .username {
    flex: 1;
  }
  .tag {
    width: 100px;
    flex-shrink: 0;
  }
}
.link {
  color: var(--link-color);
  margin-bottom: 10px;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
}
.avatar-banner {
  height: 170px;
  width: 100%;
  max-width: 500px;
  position: relative;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.3);
  margin-bottom: 50px;
  .banner-container {
    border-radius: 4px;
    overflow: hidden;
    height: 100%;
    width: 100%;
  }
  .banner {
    height: 100%;
    width: 100%;
    object-fit: cover;
    position: relative;
  }
  &.noBanner::before {
    content: "Banner";
    font-size: 24px;
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
  .avatar-container {
    position: absolute;
    bottom: -30px;
    margin-left: 20px;
    border-radius: 50%;
    .avatar-edit {
      top: -2px;
      right: -2px;
    }
  }
  .edit-button {
    cursor: pointer;
    user-select: none;
    position: absolute;
    z-index: 1;
    border-radius: 50%;
    background: var(--primary-color);
    font-size: 18px;
    transition: 0.2s;
    padding: 5px;
    &.banner-edit {
      top: -10px;
      right: -10px;
    }
    &:hover {
      opacity: 0.8;
    }
  }
}
.error {
  color: var(--alert-color);
}
.user-tag-detail {
  text-align: center;
}
</style>
