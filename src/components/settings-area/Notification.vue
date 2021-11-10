<template>
  <div class="notification">
    <div class="box">
      <div class="description">
        <div class="material-icons">info</div>
        {{ $t("settings.notification.title") }}
      </div>
      <CheckBox
        v-model="notificationSound"
        :name="$t('settings.notification.notification-sound')"
        class="check-box"
        :description="$t('settings.notification.notification-sound-details')"
        @change="notificationSoundToggled"
      />
      <CheckBox
        v-if="FCMSupported"
        v-model="pushNotification"
        class="check-box"
        :name="$t('settings.notification.push-notification')"
        @change="pushNotificationToggled"
        :description="$t('settings.notification.push-notification-details')"
      />
      <CheckBox
        v-model="notificationMentionsOnly"
        :name="$t('settings.notification.notification-mentions-only')"
        class="check-box"
        :description="$t('settings.notification.notification-mentions-only-details')"
        @change="notificationMentionsOnlyToggled"
      />
    </div>
  </div>
</template>

<script lang="ts">
import CheckBox from "@/components/CheckBox.vue";
import { messaging, messagingSupported } from "@/utils/firebaseInstance";
import { registerFCM } from "@/services/userService";

import { defineComponent } from "vue";
export default defineComponent({
  name: "NotificationArea",
  components: { CheckBox },
  data() {
    return {
      notificationSound: false,
      FCMSupported: messagingSupported,
      pushNotification: JSON.parse(localStorage["pushNotification"] || "false"),
      notificationMentionsOnly: false,
    };
  },
  mounted() {
    this.configureNotificationSound();
    this.configureNotificationMentionsOnly();
  },
  methods: {
    configureNotificationSound() {
      const state = localStorage["notificationSoundDisabled"];
      if (state === undefined) {
        this.notificationSound = true;
        return;
      }
      this.notificationSound = !JSON.parse(state);
    },
    notificationSoundToggled(state: boolean) {
      this.notificationSound = state;
      localStorage["notificationSoundDisabled"] = !state;
    },
    configureNotificationMentionsOnly() {
      const state = localStorage["notificationMentionsOnly"];
      if(state === undefined) {
        this.notificationMentionsOnly = false;
        return;
      }
      this.notificationMentionsOnly = JSON.parse(state);
    },
    notificationMentionsOnlyToggled(state: boolean) {
      this.notificationMentionsOnly = state;
      //Should be fine since not inverted like L:65.
      localStorage["notificationMentionsOnly"] = state;
    },
    pushNotificationToggled(state: boolean) {
      if (!state) {
        messaging().deleteToken();
        this.pushNotification = state;
        localStorage["pushNotification"] = state;
        return;
      }
      Notification.requestPermission((status) => {
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
    },
    registerFCMNotification() {
      messaging()
        .getToken()
        .then((token) => {
          registerFCM(token);
        });
    },
  },
});
</script>

<style lang="scss" scoped>
.notification {
  display: flex;
  flex-direction: column;
}
.description {
  display: flex;
  align-items: center;
  align-content: center;
  .material-icons {
    margin-right: 5px;
  }
  margin-bottom: 10px;
}
.title {
  margin-bottom: 5px;
}
.box {
  padding: 10px;
  align-self: flex-start;
}
.check-box {
  margin-bottom: 10px;
}
</style>
