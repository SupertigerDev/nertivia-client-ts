<template>
  <div class="container">
    <LoadingScreen v-if="invites === null" />
    <div class="inner-container" v-else>
      <div class="description">
        <div class="material-icons">info</div>
        Create Invites.
      </div>
      <div class="notice">
        Only admins can see everyones invites.
        <span v-if="isCreator"
          >To create a custom invite, your server must be
          <a
            href="https://forms.gle/WHEL6avi8Hv2cPYi9"
            target="_blank"
            rel="noopener noreferrer"
            >verified</a
          >.</span
        >
      </div>
      <div class="box">
        <CustomInput
          :class="{ disabled: !isVerified }"
          v-if="isCreator"
          title="Custom Invite"
          prefix="https://nertivia.net/invites/"
          v-model="customUrlValue"
          v-show="!selectedServerMember"
        />
        <div class="invite-list">
          <InviteTemplate
            v-for="invite in invites"
            :key="invite.invite_code"
            :invite="invite"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import CustomInput from "@/components/CustomInput.vue";
import { MeModule } from "@/store/modules/me";
import { ServersModule } from "@/store/modules/servers";
import { getInvites } from "@/services/serverService";
import LoadingScreen from "@/components/LoadingScreen.vue";
import InviteTemplate from "./InviteTemplate.vue";
import Invite from "@/interfaces/Invite";

@Component({ components: { CustomInput, LoadingScreen, InviteTemplate } })
export default class ServerSettingsArea extends Vue {
  customUrlValue = "";
  selectedServerMember: any = null;
  invites: Invite[] | null = null;
  userClicked(member: any) {
    this.selectedServerMember = member;
  }

  mounted() {
    getInvites(this.serverID).then((arr: Invite[]) => {
      const sort = arr.reverse().sort((a, b) => {
        if (a?.custom) return -1;
        return 1;
      });
      if (sort.length && sort?.[0].custom) {
        this.customUrlValue = sort[0].invite_code;
      }
      this.invites = sort;
    });
  }
  get isCreator() {
    const myUniqueID = MeModule.user.uniqueID;
    const creatorUniqueID = this.server.creator.uniqueID;
    return myUniqueID === creatorUniqueID;
  }
  get isVerified() {
    return this.server.verified;
  }
  get server() {
    return ServersModule.servers[this.serverID];
  }
  get serverID() {
    return this.$route.params.server_id;
  }
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  flex: 1;
}
.inner-container {
  margin: 10px;
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: hidden;
}
.description {
  display: flex;
  align-items: center;
  align-content: center;
  .material-icons {
    margin-right: 5px;
  }
}
.disabled {
  opacity: 0.6;
  position: relative;
  &:after {
    content: "";
    position: absolute;
    cursor: not-allowed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
}
.notice {
  color: rgba(255, 255, 255, 0.6);
  margin-left: 30px;
}
.box {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
}
.title {
  font-size: 18px;
  opacity: 0.7;
}
.user-details {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.invite-list {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: auto;
}
</style>
