<template>
  <div class="delete-account">
    <div class="description">
      <div class="material-icons">info</div>
      <span>
        You are about to delete your account
        <span class="username">{{ me.username }}:{{ me.tag }}</span>
        <span>.</span>
      </span>
    </div>
    <div class="box">
      <div class="title">What will get deleted:</div>
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
      <div class="title">What wont get deleted:</div>
      <ul class="list">
        <li>Your messages sent to public servers</li>
      </ul>
      <div class="title">Requirements:</div>
      <ul class="list">
        <li>Leave/Delete all servers <span>(Right click on a server)</span></li>
        <li>Delete all bots <span>(Settings - My Bots)</span></li>
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
        :warn="true"
        :filled="true"
        name="Delete My Account"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { getBots } from "@/services/botService";
import { MeModule } from "@/store/modules/me";
import { ServersModule } from "@/store/modules/servers";
import { Component, Vue } from "vue-property-decorator";
import CustomInput from "@/components/CustomInput.vue";
import CustomButton from "@/components/CustomButton.vue";
import { deleteAccount } from "@/services/userService";

@Component({ components: { CustomInput, CustomButton } })
export default class DeleteAccount extends Vue {
  canDelete: boolean | null = null;
  error: string | null = null;
  deleting = false;
  password = "";
  mounted() {
    if (this.servers.length) return (this.canDelete = false);
    getBots().then(res => {
      if (res.length) return (this.canDelete = false);
      this.canDelete = true;
    });
  }
  deleteAccount() {
    if (this.deleting) return;
    this.error = null;
    this.deleting = true;
    deleteAccount(this.password)
      .then(res => {
        location.href = "/";
      })
      .catch(async err => {
        if (!err.response) {
          this.error = "Could not connect to server.";
          return;
        }
        const data = await err.response.json();
        this.error = data.error;
      })
      .finally(() => {
        this.deleting = false;
      });
  }
  get servers() {
    return ServersModule.servers;
  }
  get me() {
    return MeModule.user;
  }
}
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
