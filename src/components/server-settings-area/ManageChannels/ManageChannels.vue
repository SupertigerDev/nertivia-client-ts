<template>
  <div class="container">
    <div class="inner-container">
      <div class="description">
        <div class="material-icons">info</div>
        Manage Channels
      </div>
      <div class="notice">
        Manage your channels.
      </div>
      <SelectedChannelPage
        v-if="selectedChannelID"
        :channelID="selectedChannelID"
      />
      <div class="box" v-if="!selectedChannelID">
        <CustomButton
          class="button"
          name="Create New Channel"
          icon="add"
          @click="showContext = !showContext"
        />
        <ContextMenu
          v-if="showContext"
          v-click-outside="outsideClick"
          :items="[
            { name: 'Text Channel', icon: 'textsms' },
            { name: 'HTML Channel (WIP)', icon: 'code', disabled: true }
          ]"
          :pos="{ x: 15, y: 110 }"
        />
        <div class="channel-list">
          <ChannelTemplate
            v-for="channel in channels"
            :key="channel.channelID"
            :channel="channel"
            @click.native="selectedChannelID = channel.channelID"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import CustomInput from "@/components/CustomInput.vue";
import { ServersModule } from "@/store/modules/servers";
import CustomButton from "@/components/CustomButton.vue";
import ChannelTemplate from "./ChannelTemplate.vue";
import { ChannelsModule } from "@/store/modules/channels";
import ContextMenu from "@/components/ContextMenu.vue";
import SelectedChannelPage from "./SelectedChannelPage.vue";
import Channel from "@/interfaces/Channel";
@Component({
  components: {
    CustomInput,
    CustomButton,
    ChannelTemplate,
    ContextMenu,
    SelectedChannelPage
  }
})
export default class ManageChannels extends Vue {
  showContext = false;
  selectedChannelID: string | null = null;
  outsideClick(event: any) {
    if (event.target.classList.contains("button")) return;
    this.showContext = false;
  }
  get server() {
    return ServersModule.servers[this.serverID];
  }
  get channels() {
    return ChannelsModule.sortedServerChannels(this.serverID);
  }
  get serverID() {
    return this.$route.params.server_id;
  }
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  flex: 1;
}
.inner-container {
  margin: 10px;
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: hidden;
}
.description {
  display: flex;
  align-items: center;
  align-content: center;
  .material-icons {
    margin-right: 5px;
  }
}

.notice {
  color: rgba(255, 255, 255, 0.6);
  margin-left: 30px;
}
.box {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
}
.button {
  align-self: flex-start;
  border: none;
  color: white;
  background: rgba(255, 255, 255, 0.03);
}
</style>
