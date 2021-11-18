<template>
  <div class="invite-message" :class="{ invalid }">
    <LoadingScreen v-if="loading" />
    <div class="invalid-content" v-if="invalid">
      <div class="material-icons">error_outline</div>
      Invalid Invite Code
    </div>
    <div class="loaded-content" v-if="result">
      <div class="content">
        <div class="details">
          <AvatarImage
            class="avatar"
            :imageId="result.avatar"
            :seedId="result.server_id"
            size="50px"
            :animateGif="false"
          />
          <div class="name">{{ result.name }}</div>
        </div>
        <CustomButton
          class="button"
          name="Join"
          :filled="true"
          icon="arrow_forward"
          @click="joinServer"
          iconPos="right"
          v-if="!isJoined"
        />
        <CustomButton
          v-if="isJoined"
          class="button"
          name="Visit"
          :filled="true"
          :valid="true"
          icon="login"
          @click="visitServer"
          iconPos="right"
        />
      </div>
      <div class="banner">
        <img
          loading="lazy"
          v-if="bannerURL"
          class="banner-img"
          :src="bannerURL"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  getServerInfoByCode,
  joinServerByCode,
} from "@/services/serverService";
import AvatarImage from "@/components/AvatarImage.vue";
import CustomButton from "@/components/CustomButton.vue";
import LoadingScreen from "@/components/LoadingScreen.vue";
import { ServersModule } from "@/store/modules/servers";
import { PropType } from "vue";
import { defineComponent } from "vue";
import { PopoutsModule } from "@/store/modules/popouts";
export default defineComponent({
  name: "InviteMessage",
  components: { AvatarImage, CustomButton, LoadingScreen },
  props: {
    invite: {
      type: Object as any,
      required: true,
    },
  },
  data() {
    return {
      loading: true,
      requestSent: false,
      invalid: false,
      result: null as any,
    };
  },
  computed: {
    bannerURL(): any {
      if (!this.result?.banner) return null;
      return (
        process.env.VUE_APP_NERTIVIA_CDN + this.result.banner + "?type=webp"
      );
    },
    isJoined(): any {
      return ServersModule.servers[this.result.server_id];
    },
  },
  mounted() {
    const code = this.invite[2];
    getServerInfoByCode(code)
      .then((res) => {
        this.result = res;
        this.loading = false;
      })
      .catch(() => {
        this.loading = false;
        this.invalid = true;
      });
  },
  methods: {
    visitServer() {
      this.$router.push(
        `/app/servers/${this.result.server_id}/${this.result.default_channel_id}`
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
      const code = this.invite[2];
      joinServerByCode(code, { socketID: this.$socket.id, token });
    },
  },
});
</script>

<style scoped lang="scss">
.invite-message {
  display: flex;
  border-radius: 4px;
  background: var(--card-color);
  border: 1px solid hsla(0, 0%, 100%, 0.1);
  max-width: 250px;
  overflow: hidden;
  height: 150px;
  margin-top: 5px;
  &.invalid {
    height: 50px;
  }
}
.invalid-content {
  display: flex;
  align-self: center;
  align-content: center;
  align-items: center;
  width: 100%;
  justify-content: center;
  color: rgba(255, 255, 255, 0.7);
  .material-icons {
    color: var(--alert-color);
  }
}
.loaded-content {
  display: flex;
  position: relative;
  width: 100%;
  width: 250px;
  height: 100%;
}
.banner-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.banner {
  position: relative;
  &:after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: black;
    opacity: 0.7;
  }
}
.content {
  position: absolute;
  top: 10px;
  left: 10px;
  right: 0;
  bottom: 0;
  z-index: 111;
}
.details {
  display: flex;
  align-items: center;
  .name {
    margin-left: 5px;
  }
}
.button {
  position: absolute;
  bottom: 5px;
  right: 5px;
}
</style>
