<template>
  <div class="container">
    <div class="description">
      <div class="material-icons">info</div>
      {{ $t("server-settings.general.general-server-settings") }}
    </div>
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
            :imageId="server.avatar"
            :seedId="serverID"
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
      </div>

      <CustomInput
        class="input"
        :error="errors['name']"
        title="Server Name"
        :maxChars="30"
        v-model="serverName"
      />
      <CustomDropDown
        v-if="defaultChannelId"
        class="input"
        title="Default Channel"
        :defaultId="defaultChannelId"
        IdPath="channelId"
        :key="defaultChannelId"
        @change="defaultChannelId = $event"
        :items="channels"
      />
      <CustomButton
        :filled="true"
        :name="!requestSent ? $t('save-changes') : $t('saving')"
        icon="save"
        v-if="showSaveButton"
        @click="update"
      />
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
</template>
<script lang="ts">
import CustomInput from "@/components/CustomInput.vue";
import CustomDropDown from "@/components/CustomDropDown.vue";
import CustomButton from "@/components/CustomButton.vue";
import AvatarImage from "@/components/AvatarImage.vue";
import { ServersModule } from "@/store/modules/servers";
import { ChannelsModule } from "@/store/modules/channels";
import Server from "@/interfaces/Server";
import { MeModule } from "@/store/modules/me";
import { updateServer, UpdateServerRequest } from "@/services/serverService";

import { defineComponent } from "vue";
export default defineComponent({
  name: "General",
  components: { CustomInput, CustomDropDown, AvatarImage, CustomButton },
  data() {
    return {
      serverName: "",
      defaultChannelId: "",
      newAvatar: "",
      newBanner: "",
      errors: {} as any,
      requestSent: false,
    };
  },
  computed: {
    isConnected(): any {
      return MeModule.connected;
    },
    channels(): any {
      return ChannelsModule.serverChannels(this.serverID);
    },
    server(): any {
      return ServersModule.servers[this.serverID];
    },
    bannerImageUrl(): any {
      if (this.newBanner) return this.newBanner;
      if (!this.server.banner) return undefined;
      return process.env.VUE_APP_NERTIVIA_CDN + this.server.banner;
    },
    serverID(): any {
      return this.$route.params.server_id;
    },
    showSaveButton(): any {
      const {
        bannerChanged,
        avatarChanged,
        nameChanged,
        defaultChannelChanged,
      } = this.itemsChanged;

      return (
        bannerChanged || avatarChanged || nameChanged || defaultChannelChanged
      );
    },
    itemsChanged(): any {
      const bannerChanged = this.newBanner.length || false;
      const avatarChanged = this.newAvatar.length || false;
      const nameChanged = this.serverName !== this.server.name;
      const defaultChannelChanged =
        this.defaultChannelId !== this.server.default_channel_id;
      return {
        bannerChanged,
        avatarChanged,
        nameChanged,
        defaultChannelChanged,
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
  },
  methods: {
    resetValues() {
      this.serverName = this.server?.name || "";
      this.defaultChannelId = this.server.default_channel_id;
      this.newBanner = "";
      this.newAvatar = "";
    },
    update() {
      if (this.requestSent) return;
      this.requestSent = true;
      this.errors = {};
      const data: UpdateServerRequest = {};

      this.itemsChanged.nameChanged && (data.name = this.serverName.trim());
      this.itemsChanged.defaultChannelChanged &&
        (data.default_channel_id = this.defaultChannelId);
      this.itemsChanged.avatarChanged && (data.avatar = this.newAvatar);
      this.itemsChanged.bannerChanged && (data.banner = this.newBanner);

      updateServer(this.serverID, data)
        .then((data: Partial<Server>) => {
          ServersModule.UpdateServer(data);
          this.resetValues();
          this.requestSent = false;
        })
        .catch(async (err) => {
          if (!err.response) {
            this.errors["other"] = this.$t("could-not-connect-to-server");
            this.requestSent = false;
            return;
          }
          const { errors, message } = await err.response.json();
          if (message) {
            this.errors["other"] = message;
            this.requestSent = false;
            return;
          }
          const knownErrs = ["name"];
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
    onConnectionChange(connected: boolean) {
      if (connected) this.resetValues();
    },
  },
});
</script>

<style lang="scss" scoped>
.description {
  display: flex;
  align-items: center;
  align-content: center;
  .material-icons {
    margin-right: 5px;
  }
}
.notice {
  opacity: 0.6;
  margin-left: 30px;
}
.container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 10px;
  overflow: auto;
}

.box {
  display: flex;
  flex-direction: column;
  max-width: 300px;
  width: 100%;
  margin-top: 10px;
}
.input {
  width: 100%;
}
.title {
  font-size: 18px;
  opacity: 0.7;
}

.avatar-banner {
  height: 170px;
  width: 100%;
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
</style>
