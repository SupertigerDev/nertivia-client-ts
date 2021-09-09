<template>
  <div class="server-invite-page">
    <Header />
    <div class="error" v-if="error">
      Invalid ID or you are banned from the server.
    </div>
    <LoadingScreen v-else-if="!server" />
    <div class="content" v-if="server">
      <div class="center" v-if="server">
        <AvatarImage
          :imageId="server.avatar"
          :animateGif="true"
          :seedId="server.server_id"
          size="100px"
        />
        <div class="title">Would you like to join</div>
        <div class="name">{{ server.name }}?</div>

        <CustomButton
          v-if="loggedIn"
          icon="dns"
          :name="requestSent ? 'Joining...' : 'Join Server'"
          :disabled="requestSent"
          @click="joinServer"
          :filled="true"
        />
        <CustomButton
          v-if="!loggedIn"
          icon="login"
          name="Login To Join Server"
          @click="loginButton"
          :filled="true"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Header from "@/components/home-page/Header.vue";
import LoadingScreen from "@/components/LoadingScreen.vue";
import CustomButton from "@/components/CustomButton.vue";
import AvatarImage from "@/components/AvatarImage.vue";
import Server from "@/interfaces/Server";
import { PopoutsModule } from "@/store/modules/popouts";
import {
  getServerInfoByCode,
  joinServerByCode
} from "@/services/serverService";
import Vue from "vue";
import { defineComponent } from "vue";
export default defineComponent({
  name: "InviteServer",
  components: {
    Header,
    LoadingScreen,
    AvatarImage,
    CustomButton
  },
  data() {
    return {
      server: null as Server | null,
      error: false,
      loggedIn: localStorage["hauthid"] || false,
      requestSent: false
    };
  },
  computed: {
    inviteID(): any {
      return this.$route.params.inviteid;
    }
  },
  mounted() {
    getServerInfoByCode(this.inviteID)
      .then((data: any) => {
        this.server = data;
      })
      .catch(() => (this.error = true));
  },
  methods: {
    joinServer() {
      if (this.requestSent) return;
      this.requestSent = true;
      joinServerByCode(this.inviteID)
        .then(() => {
          location.href = `/app/servers/${this.server?.server_id}/${this.server?.default_channel_id}`;
        })
        .catch(async err => {
          PopoutsModule.ShowPopout({
            id: "error",
            component: "generic-popout",
            data: {
              title: "Error Joining Server",
              description: !err.response
                ? this.$t("could-not-connect-to-server")
                : (await err.response.json()).message
            }
          });
        })
        .finally(() => (this.requestSent = false));
    },
    loginButton() {
      this.$router.push("/login?redirect=" + encodeURIComponent(location.href));
    }
  }
});
</script>

<style scoped lang="scss">
.server-invite-page {
  color: white;
  display: flex;
  flex-direction: column;
  overflow: auto;
  align-items: center;
  align-content: center;
  height: 100%;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
}
.error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
}
.title {
  margin-top: 10px;
  opacity: 0.8;
}
.name {
  font-weight: bold;
  margin-bottom: 5px;
}
.center {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.head {
  opacity: 0.6;
  margin-top: 10px;
  align-self: flex-start;
  margin-left: 5px;
}
</style>
