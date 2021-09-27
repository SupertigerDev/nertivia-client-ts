<template>
  <div class="container">
    <div class="description">
      <div class="material-icons">info</div>
      {{ $t("server-settings.notifications.description") }}
    </div>
    <div class="notice">
      {{ $t("server-settings.notifications.notice") }}
    </div>
    <div class="box">
      <div class="title">{{ $t("server-context.server-settings") }}</div>
      <RadioBox
        :items="[
          $t('server-settings.notifications.enable-notifications'),
          $t('server-settings.notifications.mute-sound'),
          $t('server-settings.notifications.disable-notifications'),
        ]"
        @change="onRadioIndexChange"
        v-model="serverNotificationOption"
      />
    </div>
  </div>
</template>
<script lang="ts">
import RadioBox from "@/components/RadioBox.vue";
import { MutedServersModule } from "@/store/modules/mutedServers";
import { muteServer } from "@/services/serverService";

import { defineComponent } from "vue";
export default defineComponent({
  name: "ServerSettingsArea",
  components: { RadioBox },
  computed: {
    serverID(): any {
      return this.$route.params.server_id;
    },
    serverNotificationOption: {
      get(): number {
        return MutedServersModule.mutedServers?.[this.serverID]?.type || 0;
      },
      set(val: number) {
        MutedServersModule.SetMutedServer({
          serverID: this.serverID,
          type: val,
        });
      },
    },
  },
  methods: {
    onRadioIndexChange(index: number) {
      muteServer(this.serverID, index);
    },
  },
});
</script>

<style lang="scss" scoped>
.description {
  display: flex;
  align-items: center;
  align-content: center;
  .material-icons {
    margin-right: 5px;
  }
}
.notice {
  opacity: 0.6;
  margin-left: 30px;
}
.container {
  margin: 10px;
}

.box {
  margin-top: 10px;
}
.title {
  font-size: 18px;
  opacity: 0.7;
}
</style>
