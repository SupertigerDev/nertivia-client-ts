<template>
  <div class="container">
    <div class="description">
      <div class="material-icons">info</div>
      Change notifications settings.
    </div>
    <div class="notice">
      These settings will only apply to you and wont affect others.
    </div>
    <div class="box">
      <div class="title">Server Settings</div>
      <RadioBox
        :items="['Enable Notifications', 'Mute Sound', 'Disable Notifications']"
        @change="onRadioIndexChange"
        v-model="serverNotificationOption"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import RadioBox from "@/components/RadioBox.vue";
import { MutedServersModule } from "@/store/modules/mutedServers";
@Component({ components: { RadioBox } })
export default class ServerSettingsArea extends Vue {
  onRadioIndexChange(index: number) {
    console.log(index);
  }

  get serverID() {
    return this.$route.params.server_id;
  }

  get serverNotificationOption() {
    return MutedServersModule.mutedServers?.[this.serverID]?.type || 0;
  }
  set serverNotificationOption(val: number) {
    //
  }
}
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
.container {
  margin: 10px;
}
.notice {
  opacity: 0.6;
  margin-left: 30px;
}
.box {
  margin-top: 10px;
}
.title {
  font-size: 18px;
  opacity: 0.7;
}
</style>
