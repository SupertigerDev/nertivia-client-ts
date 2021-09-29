<template>
  <div class="set-profile">
    <InformationTemplate
      class="info"
      title="Edit Your Profile"
      information="GIFs are allowed."
    />
    <div class="profile">
      <img v-if="bannerImageUrl" class="banner" :src="bannerImageUrl" />
      <Avatar
        :seed-id="currentUser.id || ''"
        :image-id="currentUser.avatar"
        size="120px"
        class="avatar"
        :customUrl="avatar"
      />
    </div>
    <div class="buttons">
      <CustomButton
        icon="edit"
        name="Avatar"
        @click="$refs.avatarInput.click()"
      />
      <CustomButton
        icon="edit"
        name="Banner"
        @click="$refs.bannerInput.click()"
      />
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
    <div class="user-tag">
      <CustomInput
        title="Username"
        v-model="username"
        :error="errors['username'] || errors['tag']"
        class="username"
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
    <div class="other-error" v-if="errors['other']">{{ errors["other"] }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import CustomButton from "@/components/CustomButton.vue";
import Avatar from "@/components/AvatarImage.vue";
import CustomInput from "@/components/CustomInput.vue";
import InformationTemplate from "@/components/InformationTemplate.vue";
import { MeModule } from "@/store/modules/me";
import { updateUser } from "@/services/userService";

export default defineComponent({
  components: { Avatar, CustomButton, CustomInput, InformationTemplate },
  data() {
    return {
      username: "",
      tag: "",
      banner: null,
      avatar: null,
      errors: {} as any,
    };
  },
  methods: {
    reset() {
      this.username = this.currentUser.username || "";
      this.tag = this.currentUser.tag || "";
      this.avatar = null;
      this.banner = null;
    },
    onNext() {
      if (!Object.values(this.changedValues).length) {
        this.$emit("onAction", true);
        return;
      }
      this.errors = {};
      this.save();
    },
    save() {
      updateUser(this.changedValues, this.$socket.id)
        .then((res) => {
          MeModule.UpdateUser(res);
          this.reset();
          this.$emit("onAction", true);
        })
        .catch(async (err) => {
          this.$emit("onAction", false);
          if (!err.response) {
            this.errors["other"] = this.$t("could-not-connect-to-server");
            return;
          }
          const { errors, message } = await err.response.json();
          if (message) {
            this.errors["other"] = message;
            return;
          }
          const knownErrs = ["username", "tag"];
          for (let i = 0; i < errors.length; i++) {
            const error = errors[i];
            if (!knownErrs.includes(error.param)) {
              this.errors["other"] = error.msg;
              continue;
            }
            this.errors[error.param] = error.msg;
          }
        });
    },
    avatarChange(event: any) {
      const file: File = event.target.files[0];
      event.target.value = "";
      if (!file) return;
      const reader = new FileReader();
      reader.onloadend = (event) => {
        this.avatar = (event.target?.result as any) || null;
      };
      reader.readAsDataURL(file);
    },
    bannerChange(event: any) {
      const file: File = event.target.files[0];
      event.target.value = "";
      if (!file) return;
      const reader = new FileReader();
      reader.onloadend = (event) => {
        this.banner = (event.target?.result as any) || null;
      };
      reader.readAsDataURL(file);
    },
  },

  watch: {
    connected: {
      immediate: true,
      handler() {
        this.reset();
      },
    },
  },
  computed: {
    changedValues() {
      let changed: any = {};
      if (this.avatar) changed.avatar = this.avatar;
      if (this.banner) changed.banner = this.banner;
      if (this.username !== this.currentUser.username)
        changed.username = this.username;
      if (this.tag !== this.currentUser.tag) changed.tag = this.tag;
      return changed;
    },
    bannerImageUrl(): any {
      if (this.banner) return this.banner;
      if (!this.currentUser.banner) return null;
      return process.env.VUE_APP_NERTIVIA_CDN + this.currentUser.banner;
    },
    currentUser() {
      return MeModule.user;
    },
    connected() {
      return MeModule.connected;
    },
  },
});
</script>
<style scoped lang="scss">
.set-profile {
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: center;
  height: 100%;
  justify-content: center;
}
.info {
  margin-bottom: 15px;
}
.profile {
  background-color: rgba(0, 0, 0, 0.4);
  border-radius: 4px;
  position: relative;
  max-width: 400px;
  width: 100%;
  max-height: 160px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.other-error {
  color: var(--alert-color);
  margin-top: -5px;
}
.banner {
  position: absolute;
  object-fit: cover;
  height: 100%;
  width: 100%;
  object-fit: cover;
  border-radius: 4px;
  opacity: 1;
}

.buttons {
  display: flex;
  margin-top: 20px;
}
.user-tag {
  display: flex;
  margin-top: 20px;
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
</style>
