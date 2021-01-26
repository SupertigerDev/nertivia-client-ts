<template>
  <div class="container">
    <div class="description">
      <div class="material-icons">info</div>
      General Server Settings
    </div>
    <div class="box">
      <div class="avatar-banner" :class="{ noBanner: !banenrImageUrl }">
        <img class="banner" v-if="banenrImageUrl" :src="banenrImageUrl" />
        <div class="material-icons edit-button banner-edit">edit</div>
        <div class="avatar-container">
          <AvatarImage
            class="avatar"
            :imageId="server.avatar"
            :seedId="serverID"
            size="100px"
          />
          <div class="material-icons edit-button avatar-edit">edit</div>
        </div>
      </div>

      <CustomInput class="input" title="Server Name" v-model="serverName" />
      <CustomDropDown
        class="input"
        title="Default Channel"
        :defaultIndex="defaultChannelIndex"
        :items="channels"
        v-model="serverName"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import CustomInput from "@/components/CustomInput.vue";
import CustomDropDown from "@/components/CustomDropDown.vue";
import AvatarImage from "@/components/AvatarImage.vue";
import { MutedServersModule } from "@/store/modules/mutedServers";
import { muteServer } from "@/services/serverService";
import { ServersModule } from "@/store/modules/servers";
import { ChannelsModule } from "@/store/modules/channels";
import config from "@/config";
@Component({ components: { CustomInput, CustomDropDown, AvatarImage } })
export default class General extends Vue {
  serverName = "";

  mounted() {
    this.setValues();
  }

  setValues() {
    this.serverName = this.server?.name || "";
  }
  onRadioIndexChange(index: number) {
    muteServer(this.serverID, index);
  }

  get defaultChannelIndex() {
    return this.channels.findIndex(
      c => c.channelID === this.server.default_channel_id
    );
  }

  get channels() {
    return ChannelsModule.serverChannels(this.serverID);
  }
  get server() {
    return ServersModule.servers[this.serverID];
  }
  get banenrImageUrl() {
    if (!this.server.banner) return undefined;
    return config.nertiviaCDN + this.server.banner;
  }
  get serverID() {
    return this.$route.params.server_id;
  }

  get serverNotificationOption() {
    return MutedServersModule.mutedServers?.[this.serverID]?.type || 0;
  }
  set serverNotificationOption(val: number) {
    MutedServersModule.SetMutedServer({ serverID: this.serverID, type: val });
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
.notice {
  opacity: 0.6;
  margin-left: 30px;
}
.container {
  margin: 10px;
}

.box {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 250px;
  margin-top: 10px;
}
.input {
  width: 100%;
}
.title {
  font-size: 18px;
  opacity: 0.7;
}

.avatar-banner {
  height: 200px;
  width: 400px;
  position: relative;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.3);
  margin-bottom: 60px;
  .banner {
    height: 100%;
    width: 100%;
    object-fit: cover;
    position: relative;
  }
  &.noBanner::before {
    content: "Banner";
    font-size: 24px;
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
  .avatar-container {
    position: absolute;
    bottom: -50px;
    margin-left: 20px;
    border-radius: 50%;
    .avatar-edit {
      top: 0px;
      right: 0px;
    }
  }
  .edit-button {
    cursor: pointer;
    user-select: none;
    position: absolute;
    z-index: 1;
    border-radius: 50%;
    background: var(--primary-color);
    font-size: 18px;
    transition: 0.2s;
    padding: 5px;
    &.banner-edit {
      top: -10px;
      right: -10px;
    }
    &:hover {
      opacity: 0.8;
    }
  }
}
</style>
