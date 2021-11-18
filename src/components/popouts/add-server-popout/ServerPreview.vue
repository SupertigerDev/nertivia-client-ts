<template>
  <div class="preview-server">
    <div class="banner">
      <img v-if="bannerURL" class="banner-img" :src="bannerURL" />
    </div>
    <AvatarImage
      class="avatar"
      :animateGif="true"
      :seedId="server.json.server_id"
      :imageId="server.json.avatar"
      size="80px"
    />
    <div class="name">{{ server.json.name }}</div>
    <div class="error-message">{{ error }}</div>
    <div class="buttons">
      <CustomButton
        class="button"
        :alert="true"
        :name="$t('back')"
        @click="$emit('back')"
      />
      <CustomButton
        v-if="!isJoined"
        class="button"
        name="Join Server"
        @click="joinServer"
      />
      <CustomButton
        v-if="isJoined"
        class="button"
        :valid="true"
        name="Visit Server"
        @click="visitServer"
      />
    </div>
  </div>
</template>
<script lang="ts">
import AvatarImage from "@/components/AvatarImage.vue";
import CustomButton from "@/components/CustomButton.vue";

import { ServersModule } from "@/store/modules/servers";
import { PopoutsModule } from "@/store/modules/popouts";
import { joinServerByCode } from "@/services/serverService";
import { PropType } from "vue";

interface Server {
  avatar: string;
  server_id: string;
  banner: string;
  name: string;
  default_channel_id: string;
}

import { defineComponent } from "vue";
export default defineComponent({
  name: "PreviewServer",
  components: { AvatarImage, CustomButton },
  props: {
    server: {
      type: Object as PropType<{ json: Server; code: string }>,
      required: true,
    },
  },
  data() {
    return {
      requestSent: false,
      error: null as string | null,
    };
  },
  computed: {
    bannerURL(): any {
      if (!this.server.json.banner) return undefined;
      return process.env.VUE_APP_NERTIVIA_CDN + this.server.json.banner;
    },
    isJoined(): any {
      return ServersModule.servers[this.server.json.server_id];
    },
  },
  methods: {
    visitServer() {
      PopoutsModule.ClosePopout("add-server");
      this.$router.push(
        `/app/servers/${this.server.json.server_id}/${this.server.json.default_channel_id}`
      );
    },

    joinServer() {
      PopoutsModule.ShowPopout({
        id: "captcha-popout",
        component: "CaptchaPopout",
        data: {
          callback: this.captchaVerified,
        },
      });
    },
    captchaVerified(token: string) {
      if (this.requestSent) return;
      this.requestSent = true;
      this.error = null;
      joinServerByCode(this.server.code, { socketID: this.$socket.id, token })
        .then(() => {
          PopoutsModule.ClosePopout("add-server");
          this.requestSent = false;
        })
        .catch(async (err) => {
          this.requestSent = false;
          if (!err.response) return (this.error = "Cannot connect to server.");
          const result = await err.response.json();
          this.error = result.message;
        });
    },
  },
});
</script>

<style lang="scss" scoped>
.preview-server {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  margin: 10px;
  display: flex;
  flex-direction: column;
}
.banner {
  background-position: 50%;
  background-size: cover;
  height: 150px;
  overflow: hidden;
  width: 100%;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
}
.banner-img {
  object-fit: cover;
  height: 100%;
  width: 100%;
  object-fit: cover;
}
.banner::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  border-radius: 4px;
  bottom: 0;
  transition: 0.2s;
  background: rgba(0, 0, 0, 0.3);
}
.avatar {
  z-index: 99999;
  margin-top: -50px;
  margin-left: 10px;
}
.name {
  margin-left: 10px;
  margin-top: 5px;
}

.buttons {
  margin-top: auto;
  margin-left: auto;
}
.error-message {
  height: 30px;
  margin-left: 10px;
  color: var(--alert-color);
  font-size: 14px;
}
</style>
