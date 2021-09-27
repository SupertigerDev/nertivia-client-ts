<template>
  <div class="delete-account">
    <div class="description">
      <div class="material-icons">info</div>
      <span>
        {{ $t("settings.delete-account.notice") }}
        <span class="username">{{ me.username }}:{{ me.tag }}</span>
        <span>.</span>
      </span>
    </div>
    <div class="box">
      <div class="title">
        {{ $t("settings.delete-account.what-gets-deleted") }}:
      </div>
      <ul class="list">
        <li>Username</li>
        <li>Email</li>
        <li>Avatar</li>
        <li>IP Address</li>
        <li>Hashed Password</li>
        <li>About me</li>
        <li>Custom Status</li>
        <li>Google Drive Token</li>
      </ul>
      <div class="title">
        {{ $t("settings.delete-account.what-wont-delete") }}:
      </div>
      <ul class="list">
        <li>{{ $t("settings.delete-account.messages-sent") }}</li>
      </ul>
      <div class="title">{{ $t("settings.delete-account.requirements") }}:</div>
      <!-- TODO: i18n -->
      <ul class="list">
        <li>
          {{ $t("settings.delete-account.delete-leave-server") }}
          <span>(Right click on a server)</span>
        </li>
        <li>
          {{ $t("settings.delete-account.delete-bots") }}
          <span>(Settings - My Bots)</span>
        </li>
      </ul>
      <div class="status warn" v-if="canDelete === null">
        Checking if you meet the Requirements...
      </div>
      <div class="status error" v-if="canDelete === false">
        You do not meet the Requirements above.
      </div>
      <div class="status valid" v-if="canDelete === true">
        You meet the requirements. You are free to go 😭
      </div>
      <CustomInput
        class="password-input"
        v-if="canDelete"
        title="Confirm Password"
        :error="error"
        type="password"
        v-model="password"
      />
      <CustomButton
        :disabled="deleting"
        @click="deleteAccount"
        v-if="canDelete && password"
        icon="delete"
        :alert="true"
        :filled="true"
        :name="$t('settings.delete-account.delete-account-button')"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { getBots } from "@/services/botService";
import { MeModule } from "@/store/modules/me";
import { ServersModule } from "@/store/modules/servers";
import CustomInput from "@/components/CustomInput.vue";
import CustomButton from "@/components/CustomButton.vue";
import { deleteAccount } from "@/services/userService";

import { defineComponent } from "vue";
export default defineComponent({
  name: "DeleteAccount",
  components: { CustomInput, CustomButton },
  data() {
    return {
      canDelete: null as boolean | null,
      error: null as string | null,
      deleting: false,
      password: "",
    };
  },
  computed: {
    servers(): any {
      return Object.keys(ServersModule.servers);
    },
    me(): any {
      return MeModule.user;
    },
  },
  mounted() {
    if (this.servers.length) {
      this.canDelete = false;
      return;
    }
    getBots().then((res) => {
      if (res.length) return (this.canDelete = false);
      this.canDelete = true;
    });
  },
  methods: {
    deleteAccount() {
      if (this.deleting) return;
      this.error = null;
      this.deleting = true;
      deleteAccount(this.password)
        .then(() => {
          location.href = "/";
        })
        .catch(async (err) => {
          if (!err.response) {
            this.error = this.$t("could-not-connect-to-server").toString();
            return;
          }
          const data = await err.response.json();
          this.error = data.error;
        })
        .finally(() => {
          this.deleting = false;
        });
    },
  },
});
</script>

<style lang="scss" scoped>
.delete-account {
  display: flex;
  flex-direction: column;
}
.description {
  margin: 10px;
  display: flex;
  align-items: center;
  align-content: center;
  .material-icons {
    margin-right: 5px;
  }
}
.title {
  font-weight: bold;
}
.box {
  padding: 10px;
  align-self: flex-start;
  margin-left: 5px;
}
.username {
  background: var(--alert-color);
  border-radius: 4px;
  padding: 2px;
  font-weight: bold;
  color: white;
}
.list {
  opacity: 0.7;
  margin-left: -15px;
  margin-top: 5px;
  span {
    opacity: 0.4;
    font-size: 14px;
  }
}
.status {
  &.warn {
    color: var(--warn-color);
  }
  &.error {
    color: var(--alert-color);
  }
  &.valid {
    color: var(--success-color);
  }
}
.password-input {
  margin-top: 10px;
  max-width: 250px;
}
</style>
