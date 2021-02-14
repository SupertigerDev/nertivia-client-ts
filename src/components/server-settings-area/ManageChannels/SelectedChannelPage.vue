<template>
  <div class="container">
    <CustomInput
      class="input"
      title="Channel Name"
      :error="error"
      v-model="channelName"
    />
    <!-- TODO: replace with bitwise permissions some day (just like how i made role permissions) -->
    <div class="title">Permissions</div>
    <CheckBox name="Send Message" v-model="sendMessagePermission" />
    <CustomButton
      class="button"
      :filled="true"
      :name="!requestSent ? 'Save Changes' : 'Saving...'"
      icon="save"
      v-if="showSaveButton"
      @click="update"
    />
    <CustomButton
      class="button delete-button"
      :filled="true"
      :name="
        !deleteConfirm
          ? 'Delete Channel'
          : deleteRequestSent
          ? 'Deleting Channel...'
          : 'Are you sure?'
      "
      :warn="true"
      icon="delete"
      v-if="channel.channelID !== server.default_channel_id"
      @click="deleteChannel"
    />
    <CustomButton
      class="button back-button"
      name="Back"
      @click="$emit('close')"
    />
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import CustomInput from "@/components/CustomInput.vue";
import CustomButton from "@/components/CustomButton.vue";
import CheckBox from "@/components/CheckBox.vue";

import {
  deleteServerChannel,
  updateServerChannel
} from "@/services/channelService";
import { ChannelsModule } from "@/store/modules/channels";
import { ServersModule } from "@/store/modules/servers";
import { MeModule } from "@/store/modules/me";
@Component({
  components: { CustomInput, CustomButton, CheckBox }
})
export default class ManageChannels extends Vue {
  @Prop() private channelID!: string;
  deleteConfirm = false;
  deleteRequestSent = false;
  requestSent = false;
  channelName = this.channel.name;
  error: string | null = null;
  sendMessagePermission = this.channel.permissions?.send_message || false;
  reset() {
    this.channelName = this.channel.name;
    if (this.channel.permissions?.send_message === undefined) {
      return (this.sendMessagePermission = true);
    }
    this.sendMessagePermission =
      this.channel.permissions?.send_message || false;
  }
  mounted() {
    this.reset();
  }
  @Watch("connected")
  isConnected(val: boolean) {
    if (val) {
      this.reset();
    }
  }
  deleteChannel() {
    if (!this.channel.server_id) return;
    if (this.deleteRequestSent) return;
    if (!this.deleteConfirm) {
      this.deleteConfirm = true;
      return;
    }
    this.deleteRequestSent = true;

    deleteServerChannel(this.channelID, this.channel.server_id)
      .then(() => {
        this.$emit("close");
        ChannelsModule.RemoveChannel(this.channelID);
      })
      .finally(() => {
        this.deleteRequestSent = false;
        this.deleteConfirm = false;
      });
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
  get server() {
    return ServersModule.servers[this.channel.server_id || ""];
  }
  get showSaveButton() {
    const { channelName, sendMessagePermission } = this.changed;
    return channelName || sendMessagePermission;
  }
  get changed() {
    let currentPermission = this.channel.permissions?.send_message;
    if (this.channel.permissions?.send_message === undefined) {
      currentPermission = true;
    }
    const channelName = this.channelName !== this.channel.name;
    const sendMessagePermission =
      this.sendMessagePermission !== currentPermission || false;
    return { channelName, sendMessagePermission };
  }
  get connected() {
    return MeModule.connected;
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
.delete-button {
  margin-top: 50px;
}
.back-button {
  margin: auto;
  margin-left: 0px;
  margin-bottom: 0;
}
.title {
  font-weight: bold;
  font-size: 18px;
  margin-bottom: 5px;
}
</style>
