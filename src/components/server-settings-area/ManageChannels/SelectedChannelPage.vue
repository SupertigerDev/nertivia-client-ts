<template>
  <div class="container">
    <CustomInput
      class="input"
      title="Channel Name"
      :error="error"
      v-model="channelName"
    />
    <!-- TODO: replace with bitwise permissions some day (just like how i made role permissions) -->
    <CheckBox name="Send Message" v-model="sendMessagePermission" />
    <CustomButton
      class="button"
      :filled="true"
      :name="!requestSent ? 'Save Changes' : 'Saving...'"
      icon="save"
      v-if="showSaveButton"
      @click="update"
    />
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import CustomInput from "@/components/CustomInput.vue";
import CustomButton from "@/components/CustomButton.vue";
import CheckBox from "@/components/CheckBox.vue";

import { updateServerChannel } from "@/services/serverService";
import { ChannelsModule } from "@/store/modules/channels";
@Component({
  components: { CustomInput, CustomButton, CheckBox }
})
export default class ManageChannels extends Vue {
  @Prop() private channelID!: string;
  requestSent = false;
  channelName = this.channel.name;
  error: string | null = null;
  sendMessagePermission = this.channel.permissions?.send_message || false;
  reset() {
    this.channelName = this.channel.name;
    this.sendMessagePermission =
      this.channel.permissions?.send_message || false;
  }
  update() {
    if (this.requestSent) return;
    this.requestSent = true;
    if (!this.channel.server_id) return;
    updateServerChannel(this.channel.channelID, this.channel.server_id, {
      name: this.channelName,
      permissions: { send_message: this.sendMessagePermission }
    })
      .then(json => {
        ChannelsModule.updateChannel({
          channelID: json.channelID,
          update: json
        });
        this.reset();
      })
      .catch(async err => {
        if (!err.response) {
          return (this.error = "Could not connect to server.");
        }
        const json = await err.response.json();
        const { errors, message } = json;
        if (message) return (this.error = message);
        for (let i = 0; i < errors.length; i++) {
          const error = errors[i];
          this.error = error.msg;
        }
      })
      .finally(() => (this.requestSent = false));
  }
  get channel() {
    return ChannelsModule.channels[this.channelID];
  }
  get showSaveButton() {
    const { channelName, sendMessagePermission } = this.changed;
    return channelName || sendMessagePermission;
  }
  get changed() {
    const channelName = this.channelName !== this.channel.name;
    const sendMessagePermission =
      this.sendMessagePermission !== this.channel.permissions?.send_message ||
      false;
    return { channelName, sendMessagePermission };
  }
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  align-items: flex-start;
}
.input {
  margin-left: -2px;
}
.button {
  margin-top: 10px;
  margin-left: 0;
}
</style>
