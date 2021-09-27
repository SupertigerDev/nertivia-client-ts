<template>
  <div class="container">
    <LoadingScreen v-if="invites === null" />
    <div class="inner-container" v-else>
      <div class="description">
        <div class="material-icons">info</div>
        {{ $t("server-settings.manage-invites.create-invites") }}
      </div>
      <div class="notice">
        {{ $t("server-settings.manage-invites.notice") }}
        <span v-if="isCreator"
          ><!-- TODO: i18n -->
          To create a custom invite, your server must be
          <a
            href="https://forms.gle/WHEL6avi8Hv2cPYi9"
            target="_blank"
            rel="noopener noreferrer"
            >verified</a
          >.</span
        >
      </div>
      <div class="box">
        <div
          class="custom-invite"
          v-if="isCreator"
          :class="{ disabled: !isVerified }"
        >
          <CustomInput
            class="input"
            :title="$t('server-settings.manage-invites.custom-invite')"
            :prefix="prefixLink"
            v-model="customUrlValue"
            :error="customUrlError"
            v-show="!selectedServerMember"
          />
          <CustomButton
            class="button"
            :title="$t('server-settings.manage-invites.save-custom-link')"
            icon="save"
            @click="saveCustomInvite"
          />
        </div>
        <CustomButton
          :name="$t('server-settings.manage-invites.create-invite')"
          icon="add"
          @click="createInvite"
        />
        <div class="error" v-if="error">{{ error }}</div>
        <div class="invite-list">
          <InviteTemplate
            v-for="invite in sortedInvites"
            :key="invite.invite_code"
            @deleteClicked="deleteInvite(invite)"
            :invite="invite"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import CustomInput from "@/components/CustomInput.vue";
import { MeModule } from "@/store/modules/me";
import { ServersModule } from "@/store/modules/servers";
import {
  createCustomInvite,
  createInvite,
  deleteInvite,
  getInvites,
} from "@/services/serverService";
import LoadingScreen from "@/components/LoadingScreen.vue";
import CustomButton from "@/components/CustomButton.vue";
import InviteTemplate from "./InviteTemplate.vue";
import Invite from "@/interfaces/Invite";

import { defineComponent } from "vue";
export default defineComponent({
  name: "ServerSettingsArea",
  components: { CustomInput, LoadingScreen, InviteTemplate, CustomButton },
  data() {
    return {
      prefixLink: process.env.VUE_APP_MAIN_APP_URL + "i/",
      customUrlValue: "",
      selectedServerMember: null as any,
      invites: null as Invite[] | null,
      creating: false,
      error: null as string | null,
      customUrlError: null as string | null,
    };
  },
  computed: {
    isCreator(): any {
      const myID = MeModule.user.id;
      const creatorID = this.server.creator.id;
      return myID === creatorID;
    },
    sortedInvites(): any {
      if (!this.invites) return null;
      const sort = [...this.invites].reverse().sort((a) => {
        if (a?.custom) return -1;
        return 1;
      });
      return sort;
    },
    isVerified(): any {
      return this.server.verified;
    },
    server(): any {
      return ServersModule.servers[this.serverID];
    },
    serverID(): any {
      return this.$route.params.server_id;
    },
  },
  mounted() {
    getInvites(this.serverID).then((arr: Invite[]) => {
      this.invites = arr;
      if (this.sortedInvites.length && this.sortedInvites?.[0].custom) {
        this.customUrlValue = this.sortedInvites[0].invite_code;
      }
    });
  },
  methods: {
    userClicked(member: any) {
      this.selectedServerMember = member;
    },
    saveCustomInvite() {
      if (!this.invites) return;
      if (this.creating) return;
      this.creating = true;
      this.customUrlError = null;
      const customUrl = this.customUrlValue.trim();
      const customInviteIndex = this.invites.findIndex((i) => i.custom) || -1;
      if (!customUrl.length && this.invites[customInviteIndex]) {
        this.deleteInvite(this.invites[customInviteIndex]);
        return;
      }
      createCustomInvite(this.serverID, customUrl)
        .then(() => {
          if (customInviteIndex >= 0 && this.invites?.[customInviteIndex]) {
            this.invites[customInviteIndex].invite_code = customUrl;
          } else {
            this.invites?.push({
              custom: true,
              creator: MeModule.user as any,
              invite_code: customUrl,
              uses: 0,
            });
          }
          this.creating = false;
        })
        .catch(async (err) => {
          this.creating = false;
          if (!err.response) {
            return (this.customUrlError = this.$t(
              "could-not-connect-to-server"
            ).toString());
          }
          const json = await err.response.json();
          return (this.customUrlError = json.message);
        });
    },
    createInvite() {
      if (this.creating) return;
      this.error = null;
      this.creating = true;
      createInvite(this.serverID)
        .then((invite: { invite_code: string }) => {
          this.invites?.push({
            creator: MeModule.user as any,
            invite_code: invite.invite_code,
            uses: 0,
            custom: false,
          });
          this.creating = false;
        })
        .catch(async (err) => {
          this.creating = false;
          if (!err.response) {
            this.error = this.$t("could-not-connect-to-server").toString();
            return;
          }
          const json = await err.response.json();
          this.error = json.message;
        });
    },
    deleteInvite(invite: Invite) {
      deleteInvite(invite.invite_code).then(() => {
        if (!this.invites) return;
        this.invites = this.invites?.filter(
          (i) => i.invite_code !== invite.invite_code
        );
        if (invite.custom) {
          this.customUrlValue = "";
        }
      });
    },
  },
});
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
.error {
  color: var(--alert-color);
}
.custom-invite {
  display: flex;
  .input {
    flex: 1;
  }
  .button {
    margin: auto;
    margin-bottom: 25px;
    margin-left: 10px;
  }
}
</style>
