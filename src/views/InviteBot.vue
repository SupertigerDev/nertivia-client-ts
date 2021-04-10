<template>
  <div class="invite-bot-page">
    <Header />
    <LoadingScreen v-if="!bot" />
    <div class="content" v-if="bot">
      <div class="center" v-if="bot">
        <AvatarImage :imageId="bot.avatar" :seedId="bot.id" size="100px" />
        <div class="title">Would you like to invite</div>
        <div class="name">{{ bot.username }}?</div>
        <div class="head" v-if="perms.length">This Bot Can:</div>
        <div class="perms-list">
          <CheckBox
            v-for="(perm, i) of perms"
            :key="i"
            :checked="true"
            :name="perm.name"
            :description="perm.info"
          />
        </div>
        <CustomDropDown
          class="drop-down"
          v-if="loggedIn"
          title="Invite To"
          @change="selectedServer"
          :items="mappedServers"
          defaultText="Select Server"
          IdPath="server_id"
        />
        <CustomButton
          v-if="loggedIn && selectedServerID"
          icon="add"
          :name="requestSent ? 'Inviting...' : 'Invite Bot'"
          :disabled="requestSent"
          @click="inviteBot"
          :filled="true"
        />
        <CustomButton
          v-if="!loggedIn"
          icon="login"
          name="Login To Invite Bot"
          @click="loginButton"
          :filled="true"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Header from "@/components/home-page/Header.vue";
import LoadingScreen from "@/components/LoadingScreen.vue";
import CheckBox from "@/components/CheckBox.vue";
import CustomButton from "@/components/CustomButton.vue";
import AvatarImage from "@/components/AvatarImage.vue";
import CustomDropDown from "@/components/CustomDropDown.vue";
import { permissions } from "@/constants/rolePermissions";
import User from "@/interfaces/User";
import { getBot, inviteBot } from "@/services/botService";
import Server from "@/interfaces/Server";
import { PopoutsModule } from "@/store/modules/popouts";
import { bitwiseContains } from "@/utils/bitwise";

@Component({
  components: {
    Header,
    CheckBox,
    LoadingScreen,
    AvatarImage,
    CustomButton,
    CustomDropDown
  }
})
export default class InviteBot extends Vue {
  bot: User | null = null;
  servers: Partial<Server>[] | null = null;
  loggedIn = false;
  selectedServerID: string | null = null;
  requestSent = false;

  selectedServer(serverID: any) {
    this.selectedServerID = serverID;
  }
  inviteBot() {
    if (!this.bot?.id) return;
    if (!this.selectedServerID) return;
    if (this.requestSent) return;
    this.requestSent = true;
    inviteBot(this.bot.id, this.selectedServerID, this.permNumber)
      .then(() => {
        location.href = "/app";
      })
      .catch(async err => {
        PopoutsModule.ShowPopout({
          id: "error",
          component: "generic-popout",
          data: {
            title: "Error Creating Bot",
            description: !err.response
              ? "Could not connect to server."
              : (await err.response.json()).message
          }
        });
      })
      .finally(() => (this.requestSent = false));
  }
  loginButton() {
    this.$router.push("/login?redirect=" + encodeURIComponent(location.href));
  }
  mounted() {
    getBot(this.botID, false, true).then((data: any) => {
      if (data.servers) {
        this.servers = data.servers;
        this.bot = data.bot;
        this.loggedIn = true;
        return;
      }
      this.bot = data;
    });
  }
  get mappedServers() {
    return (
      this.servers?.map(server => {
        return {
          name: server.name,
          server_id: server.server_id,
          avatar: {
            seedID: server.server_id,
            imageID: server.avatar
          }
        };
      }) || []
    );
  }
  get botID() {
    return this.$route.params.botid;
  }
  get permNumber() {
    const str: any = this.$route.query.perms;
    return parseInt(str || "0") || 0;
  }
  get perms() {
    return Object.values(permissions).filter(p =>
      bitwiseContains(this.permNumber, p.value)
    );
  }
}
</script>

<style scoped lang="scss">
.invite-bot-page {
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
.drop-down {
  width: 100%;
  margin-top: 10px;
  z-index: 111111;
}
</style>
