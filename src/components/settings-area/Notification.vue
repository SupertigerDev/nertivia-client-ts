<template>
  <div class="notification">
    <div class="description">Change your notification settings. WIP.</div>
    <div class="box">
      <CheckBox
        v-model="notificationSound"
        name="Notification Sound"
        @change="notificationSoundToggled"
      />
      <div class="details">Makes a cool sound to get your attention.</div>
      <CheckBox
        v-model="pushNotification"
        name="Push Notification"
        @change="pushNotificationToggled"
      />
      <div class="details">
        Get push notifications even when the app is closed. (Most useful to use
        on a mobile)
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import CheckBox from "@/components/CheckBox.vue";
import { messaging } from "@/utils/firebaseInstance";
import { registerFCM } from "@/services/userService";

@Component({ components: { CheckBox } })
export default class NotificationArea extends Vue {
  notificationSound = false;
  pushNotification = JSON.parse(localStorage["pushNotification"] || "false");
  mounted() {
    this.configureNotificationSound();
  }
  configureNotificationSound() {
    const state = localStorage["notificationSoundDisabled"];
    if (state === undefined) {
      this.notificationSound = true;
      return;
    }
    this.notificationSound = !JSON.parse(state);
  }

  notificationSoundToggled(state: boolean) {
    this.notificationSound = state;
    localStorage["notificationSoundDisabled"] = !state;
  }
  pushNotificationToggled(state: boolean) {
    if (!state) {
      messaging().deleteToken();
      this.pushNotification = state;
      localStorage["pushNotification"] = state;
      return;
    }
    Notification.requestPermission(status => {
      if (status !== "granted") {
        alert("Permission for notifications is blocked.");
        this.pushNotification = false;
        localStorage["pushNotification"] = false;
        return;
      }
      // enable notification
      this.pushNotification = true;
      localStorage["pushNotification"] = true;
      this.registerFCMNotification();
    });
  }
  registerFCMNotification() {
    messaging()
      .getToken()
      .then(token => {
        registerFCM(token);
      });
  }
}
</script>

<style lang="scss" scoped>
.notification {
  display: flex;
  flex-direction: column;
}
.description {
  opacity: 0.7;
  margin: 5px;
}
.title {
  margin-bottom: 5px;
}
.box {
  padding: 10px;
  align-self: flex-start;
  margin-left: 5px;
}
.details {
  opacity: 0.6;
  font-size: 14px;
  margin-left: 20px;
}
</style>
