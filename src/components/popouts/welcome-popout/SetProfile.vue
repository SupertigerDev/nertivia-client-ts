<template>
  <div class="set-profile">
    <div class="profile">
      <img v-if="bannerImageUrl" class="banner" :src="bannerImageUrl" />
      <Avatar
        :seed-id="currentUser.id || ''"
        :image-id="currentUser.avatar"
        size="120px"
        class="avatar"
      />
    </div>
    <div class="buttons">
      <CustomButton icon="edit" name="Avatar" />
      <CustomButton icon="edit" name="Banner" />
    </div>
    <div class="user-tag">
      <CustomInput
        title="Username"
        v-model="username"
        class="username"
        prefixIcon="account_box"
        :connectRight="true"
      />
      <CustomInput
        class="tag"
        title="Tag"
        v-model="tag"
        prefixIcon="local_offer"
        :connectLeft="true"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import CustomButton from "@/components/CustomButton.vue";
import Avatar from "@/components/AvatarImage.vue";
import CustomInput from "@/components/CustomInput.vue";
import { MeModule } from "@/store/modules/me";

export default defineComponent({
  components: { Avatar, CustomButton, CustomInput },
  data() {
    return {
      username: "",
      tag: "",
      banner: null,
    };
  },
  methods: {
    reset() {
      this.username = this.currentUser.username || "";
      this.tag = this.currentUser.tag || "";
    },
    onNext() {
      this.$emit("onAction", true);
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
.banner {
  position: absolute;
  object-fit: cover;
  height: 100%;
  width: 100%;
  object-fit: cover;
  border-radius: 4px;
  opacity: 1;
}
.avatar {
  border-radius: 50%;
  z-index: 1111;
  box-shadow: 0 0 8px 1px black;
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
<style>
.welcome-popout .avatar .image {
  border: none;
}
</style>
