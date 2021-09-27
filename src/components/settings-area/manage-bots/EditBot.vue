<template>
  <div class="interface">
    <div class="box">
      <div class="error" v-if="errors['other']">{{ errors["other"] }}</div>
      <div class="outer-avatar">
        <div class="avatar" @click="$refs.avatarInput.click()">
          <div class="material-icons edit-button">edit</div>
          <AvatarImage
            :imageId="bot.avatar"
            :seedId="bot.id"
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
          <div class="user-tag-detail">{{ bot.username }}:{{ bot.tag }}</div>
        </div>
      </div>
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

      <CustomButton
        :filled="true"
        :name="!requestSent ? $t('save-changes') : $t('saving')"
        icon="save"
        style="margin-bottom: 10px"
        v-if="showSaveButton"
        @click="update"
      />

      <InformationTemplate
        style="margin-bottom: 10px; opacity: 0.7"
        :title="$t('settings.manage-bots.create-invite-link')"
      />
      <CustomInput
        title="Invite Link"
        :disabled="true"
        v-model="inviteLink"
        class="input"
        prefixIcon="link"
      />
      <!-- Perms  -->
      <div class="perms-list" style="margin-bottom: 10px">
        <CheckBox
          v-for="(perm, i) of perms"
          :key="i"
          :modelValue="perm.hasPerm"
          :name="perm.name"
          @change="onPermToggle($event, perm)"
          :description="perm.info"
        />
      </div>
      <CustomButton
        :name="$t('settings.manage-bots.copy-invite-url')"
        :filled="true"
        icon="developer_board"
        style="align-self: flex-start; margin-left: -2px"
        @click="copyInvite"
      />
      <InformationTemplate
        style="margin-bottom: 10px; margin-top: 10px; opacity: 0.7"
        :title="$t('settings.manage-bots.manage-token')"
      />
      <div class="link" v-if="!showToken" @click="showToken = true">
        {{ $t("settings.manage-bots.show-token") }}
      </div>
      <CustomInput
        title="Token"
        modelValue="botToken"
        class="input"
        :disabled="true"
        v-if="showToken"
        prefixIcon="vpn_key"
      />
      <div class="buttons">
        <CustomButton
          :name="$t('settings.manage-bots.copy-token')"
          icon="developer_board"
          :filled="true"
          @click="copyToken"
        />
        <CustomButton
          :name="$t('settings.manage-bots.reset-token')"
          icon="restart_alt"
          :alert="true"
          @click="resetToken"
        />
      </div>
      <InformationTemplate
        style="margin-bottom: 10px; margin-top: 10px; opacity: 0.7"
        :title="$t('settings.manage-bots.delete-bot')"
      />
      <CustomButton
        :name="
          deleteBotConfirm
            ? $t('are-you-sure')
            : $t('settings.manage-bots.delete-bot')
        "
        icon="delete"
        :alert="true"
        @click="deleteBot"
        style="align-self: flex-start"
      />
    </div>
  </div>
</template>

<script lang="ts">
import CustomInput from "@/components/CustomInput.vue";
import CustomButton from "@/components/CustomButton.vue";
import AvatarImage from "@/components/AvatarImage.vue";
import InformationTemplate from "@/components/InformationTemplate.vue";
import User from "@/interfaces/User";
import { deleteBot, resetBotToken, updateBot } from "@/services/botService";
import { PopoutsModule } from "@/store/modules/popouts";
import { bitwiseRemove, bitwiseContains, bitwiseAdd } from "@/utils/bitwise";

import { permissions } from "@/constants/rolePermissions";
import CheckBox from "@/components/CheckBox.vue";
import { PropType } from "vue";
import { defineComponent } from "vue";
import { toClipboard } from "@soerenmartius/vue3-clipboard";
export default defineComponent({
  name: "Account",
  components: {
    CustomInput,
    CustomButton,
    AvatarImage,
    InformationTemplate,
    CheckBox,
  },
  props: {
    bot: {
      type: Object as PropType<User>,
      required: true,
    },
    botToken: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      username: "",
      tag: "",
      newAvatar: null as string | null,
      showToken: false,
      requestSent: false,
      errors: {} as any,
      deleteBotConfirm: false,
      permissions: permissions.SEND_MESSAGES.value,
    };
  },
  computed: {
    perms(): any {
      return Object.values(permissions).map((p) => {
        return { ...p, hasPerm: !!bitwiseContains(this.permissions, p.value) };
      });
    },
    inviteLink(): any {
      if (!process.env.VUE_APP_MAIN_APP_URL) return "";
      return (
        process.env.VUE_APP_MAIN_APP_URL +
        `bots/${this.bot.id}?perms=${this.permissions}`
      );
    },
    showSaveButton(): any {
      const { usernameChanged, tagChanged, avatarChanged } = this.changedItems;

      return usernameChanged || tagChanged || avatarChanged;
    },
    changedItems(): any {
      const bot = this.bot;
      const usernameChanged = this.username !== bot.username;
      const tagChanged = this.tag !== bot.tag;
      const avatarChanged = this.newAvatar?.length || false;
      return {
        usernameChanged,
        tagChanged,
        avatarChanged,
      };
    },
  },
  mounted() {
    this.resetValues();
  },
  methods: {
    deleteBot() {
      if (!this.deleteBotConfirm) {
        this.deleteBotConfirm = true;
        return;
      }
      deleteBot(this.bot.id)
        .then(() => {
          this.$emit("deleted");
        })
        .finally(() => (this.deleteBotConfirm = false));
    },
    onPermToggle(newChecked: boolean, perm: any) {
      if (newChecked) {
        this.permissions = bitwiseAdd(this.permissions, perm.value);
      } else {
        this.permissions = bitwiseRemove(this.permissions, perm.value);
      }
    },
    copyInvite() {
      toClipboard(this.inviteLink);
      PopoutsModule.ShowPopout({
        id: "copy-bot-invite-url",
        component: "generic-popout",
        data: {
          title: "Bot Invite Copied!",
          description: "URL Coppied!",
        },
      });
    },
    copyToken() {
      toClipboard(this.botToken || "");
      PopoutsModule.ShowPopout({
        id: "copy-token",
        component: "generic-popout",
        data: {
          title: "Don't Paste It In Chats!",
          description: "Token Copied.",
        },
      });
    },
    resetToken() {
      resetBotToken(this.bot.id).then(({ token }) => {
        this.$emit("tokenChanged", token);
        PopoutsModule.ShowPopout({
          id: "change-bot-token",
          component: "generic-popout",
          data: {
            title: "Token Changed",
            description: "Token Changed. All connections have been kicked.",
          },
        });
      });
    },
    update() {
      if (this.requestSent) return;
      this.requestSent = true;
      this.errors = {};
      const data: any = {};

      this.changedItems.usernameChanged &&
        (data.username = this.username.trim());
      this.changedItems.tagChanged && (data.tag = this.tag.trim());
      this.changedItems.avatarChanged && (data.avatar = this.newAvatar || "");

      updateBot(this.bot.id, data)
        .then((json) => {
          this.$emit("updated", json);
          this.$nextTick(() => {
            this.resetValues();
          });
        })
        .catch(async (err) => {
          if (!err.response) {
            this.errors["other"] = this.$t(
              "could-not-connect-to-server"
            ).toString();
            return;
          }
          const knownErrs = ["username", "tag"];
          const { errors, message } = await err.response.json();
          if (message) {
            this.errors["other"] = message;
            return;
          }
          for (let i = 0; i < errors.length; i++) {
            const error = errors[i];
            if (!knownErrs.includes(error.param)) {
              this.errors["other"] = error.msg;
              continue;
            }
            this.errors[error.param] = error.msg;
          }
        })
        .finally(() => (this.requestSent = false));
    },
    resetValues() {
      this.username = this.bot.username || "";
      this.tag = this.bot.tag || "";
      this.newAvatar = null;
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
  },
});
</script>

<style lang="scss" scoped>
.interface {
  display: flex;
  flex-direction: column;
  overflow: auto;
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
.link {
  color: var(--link-color);
  margin-bottom: 5px;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
}
.error {
  color: var(--alert-color);
}
.user-tag-detail {
  text-align: center;
}
.buttons {
  display: flex;
  margin-left: -5px;
}
</style>
