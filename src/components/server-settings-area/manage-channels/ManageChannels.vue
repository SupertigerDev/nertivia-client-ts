<template>
  <div class="container manage-channels">
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
        @close="selectedChannelID = null"
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
          @itemClick="createChannel"
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
import { createServerChannel } from "@/services/channelService";
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
  createRequestSent = false;
  outsideClick(event: any) {
    if (event.target.classList.contains("button")) return;
    this.showContext = false;
  }

  createChannel() {
    this.showContext = false;
    if (this.createRequestSent) return;
    this.createRequestSent = true;
    createServerChannel(this.serverID)
      .then(json => {
        ChannelsModule.AddChannel(json.channel);
        this.selectedChannelID = json.channel.channelID;
      })
      .finally(() => {
        this.createRequestSent = false;
      });
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
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: hidden;
}
.description {
  display: flex;
  align-items: center;
  align-content: center;
  margin-left: 10px;
  margin-top: 10px;
  .material-icons {
    margin-right: 5px;
  }
}

.channel-list {
  display: flex;
  flex-direction: column;
  overflow: auto;
  padding: 10px;
}
.notice {
  color: rgba(255, 255, 255, 0.6);
  margin-left: 40px;
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
  margin-left: 10px;
  background: rgba(255, 255, 255, 0.03);
}
</style>
