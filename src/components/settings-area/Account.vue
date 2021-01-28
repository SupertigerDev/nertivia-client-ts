<template>
  <div class="interface">
    <div class="description">Edit your profile.</div>
    <div class="box">
      <div class="error" v-if="errors['other']">{{ errors["other"] }}</div>
      <div class="outer-avatar">
        <div class="avatar" @click="$refs.avatarInput.click()">
          <div class="material-icons edit-button">edit</div>
          <AvatarImage
            :imageId="me.avatar"
            :seedId="me.uniqueID"
            :customUrl="newAvatar"
            size="100px"
          />
          <input
            ref="avatarInput"
            style="display: none"
            type="file"
            @change="avatarChange"
            accept=".jpeg, .jpg, .png, .gif"
          />
        </div>
        <div class="details">
          <div class="user-tag-detail">{{ me.username }}:{{ me.tag }}</div>
        </div>
      </div>
      <CustomInput title="Email" v-model="email" prefixIcon="alternate_email" />
      <div class="user-tag">
        <CustomInput
          title="Username"
          v-model="username"
          class="input"
          :error="errors['username'] || errors['tag']"
          prefixIcon="account_box"
        />
        <CustomInput
          class="tag"
          title="Tag"
          :error="errors['tag'] ? ' ' : undefined"
          v-model="tag"
          prefixIcon="local_offer"
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
        Change Password
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
      <CustomButton
        :filled="true"
        :name="!requestSent ? 'Save Changes' : 'Saving...'"
        icon="save"
        v-if="showSaveButton"
        @click="update"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import CustomInput from "@/components/CustomInput.vue";
import CustomButton from "@/components/CustomButton.vue";
import AvatarImage from "@/components/AvatarImage.vue";
import { MeModule } from "@/store/modules/me";
import { updateUser, UpdateUserRequest } from "@/services/userService";
import { updateInstance } from "@/services/wrapper";
@Component({ components: { CustomInput, CustomButton, AvatarImage } })
export default class Account extends Vue {
  email = "";
  username = "";
  tag = "";
  password = "";
  showNewPassword = false;
  newPassword = "";
  newPasswordConfirm = "";
  newAvatar: string | null = null;

  requestSent = false;
  errors: any = {};

  mounted() {
    this.resetValues();
  }

  resetValues() {
    this.email = MeModule.user.email || "";
    this.username = MeModule.user.username || "";
    this.tag = MeModule.user.tag || "";
    this.password = "";
    this.showNewPassword = false;
    this.newPassword = "";
    this.newPasswordConfirm = "";
    this.newAvatar = null;
  }

  avatarChange(event: any) {
    const file: File = event.target.files[0];
    event.target.value = "";
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = event => {
      this.newAvatar = (event.target?.result as any) || null;
    };
    reader.readAsDataURL(file);
  }

  update() {
    if (this.requestSent) return;
    this.errors = {};
    this.requestSent = true;
    const data: UpdateUserRequest = {};

    this.changedItems.usernameChanged && (data.username = this.username.trim());
    this.changedItems.tagChanged && (data.tag = this.tag.trim());
    this.password.trim().length && (data.password = this.password.trim());
    this.changedItems.newPasswordChanged &&
      (data.new_password = this.newPassword.trim());
    this.changedItems.emailChanged && (data.email = this.email.trim());
    this.changedItems.avatarChanged && (data.avatar = this.newAvatar || "");

    if (!this.showPassword) delete data["password"];

    if (data.new_password && data.new_password !== this.newPasswordConfirm) {
      this.errors["confirm_new_password"] = "Passwords do not match!";
      this.requestSent = false;
      return;
    }

    updateUser(data, this.$socket.client.id)
      .then(res => {
        if (res.token) {
          localStorage["hauthid"] = res.token;
          delete res.token;
          updateInstance();
        }
        MeModule.UpdateUser(res);
        this.resetValues();
        this.requestSent = false;
      })
      .catch(async err => {
        if (!err.response) {
          this.errors["other"] = "Could not connect to server.";
          this.requestSent = false;
          return;
        }
        const knownErrs = ["username", "tag", "password", "new_password"];
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
          this.$set(this.errors, error.param, error.msg);
        }
        this.requestSent = false;
      });
  }

  @Watch("isConnected")
  onConnectionChange(connected: boolean) {
    if (connected) this.resetValues();
  }

  get me() {
    return MeModule.user;
  }
  get isConnected() {
    return MeModule.connected;
  }
  get showPassword() {
    const {
      emailChanged,
      usernameChanged,
      tagChanged,
      newPasswordChanged
    } = this.changedItems;

    const othersChanged =
      emailChanged || usernameChanged || tagChanged || newPasswordChanged;

    return othersChanged || this.showNewPassword;
  }

  get showSaveButton() {
    const {
      emailChanged,
      usernameChanged,
      tagChanged,
      newPasswordChanged,
      avatarChanged
    } = this.changedItems;

    return (
      emailChanged ||
      usernameChanged ||
      tagChanged ||
      newPasswordChanged ||
      avatarChanged
    );
  }
  get changedItems() {
    const me = this.me;
    const emailChanged = this.email !== me.email;
    const usernameChanged = this.username !== me.username;
    const tagChanged = this.tag !== me.tag;
    const newPasswordChanged = this.newPassword.length;
    const avatarChanged = this.newAvatar?.length || false;
    return {
      emailChanged,
      usernameChanged,
      tagChanged,
      newPasswordChanged,
      avatarChanged
    };
  }
}
</script>

<style lang="scss" scoped>
.interface {
  display: flex;
  flex-direction: column;
  overflow: auto;
}
.description {
  opacity: 0.7;
  margin: 5px;
}
.title {
  margin-bottom: 5px;
}
.box {
  display: flex;
  flex-direction: column;
  padding: 10px;
  align-self: flex-start;
  margin-left: 5px;
}
.user-tag {
  display: flex;
  .input {
    flex-shrink: initial;
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
.outer-avatar {
  display: flex;
  flex-direction: column;
  align-self: center;
  margin-bottom: 10px;
}
.avatar {
  position: relative;
  align-self: center;
  margin-bottom: 5px;
  cursor: pointer;
  &:hover {
    opacity: 0.7;
  }
  .edit-button {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 1;
    border-radius: 50%;
    background: var(--primary-color);
    font-size: 18px;
    padding: 5px;
  }
}
.error {
  color: var(--alert-color);
}
</style>
