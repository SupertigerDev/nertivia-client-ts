<template>
  <div class="container manage-channels">
    <div class="inner-container">
      <div class="description">
        <div class="material-icons">info</div>
        {{ $t("server-settings.tab-names.manage-channels") }}
      </div>
      <div class="notice">
        {{ $t("server-settings.manage-channels.manage-your-channels") }}
      </div>
      <SelectedChannelPage
        v-if="selectedChannelID"
        :channelID="selectedChannelID"
        @close="selectedChannelID = null"
      />
      <div class="box" v-if="!selectedChannelID">
        <CustomButton
          class="button"
          :name="$t('server-settings.manage-channels.create-new-channel')"
          icon="add"
          @click="showContext = !showContext"
        />
        <ContextMenu
          v-if="showContext"
          v-click-outside="outsideClick"
          :items="[
            {
              name: $t('server-settings.manage-channels.text-channel'),
              icon: 'textsms'
            },
            {
              name: $t('server-settings.manage-channels.html-channel'),
              icon: 'code',
              disabled: true
            }
          ]"
          :pos="{ x: 15, y: 110 }"
          @itemClick="createChannel"
        />
        <div class="channel-list">
          <Draggable
            :animation="200"
            :delay="$isMobile ? 400 : 0"
            ghost-class="ghost"
            v-model="channels"
            @end="onDragEnd"
          >
            <ChannelTemplate
              v-for="channel in channels"
              :key="channel.channelID"
              :channel="channel"
              @click.native="selectedChannelID = channel.channelID"
            />
          </Draggable>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Draggable from "vuedraggable";
import { ServersModule } from "@/store/modules/servers";
import CustomButton from "@/components/CustomButton.vue";
import ChannelTemplate from "./ChannelTemplate.vue";
import { ChannelsModule } from "@/store/modules/channels";
import ContextMenu from "@/components/ContextMenu.vue";
import SelectedChannelPage from "./SelectedChannelPage.vue";
import {
  createServerChannel,
  updateServerChannelPosition
} from "@/services/channelService";
import Channel from "@/interfaces/Channel";
import Vue from "vue";
import { defineComponent } from "vue";
export default defineComponent({
  name: "ManageChannels",
  components: {
    CustomButton,
    ChannelTemplate,
    ContextMenu,
    SelectedChannelPage,
    Draggable
  },
  data() {
    return {
      showContext: false,
      selectedChannelID: null as string | null,
      createRequestSent: false
    };
  },
  computed: {
    server(): any {
      return ServersModule.servers[this.serverID];
    },
    channels: {
      get(): Channel[] {
        return ChannelsModule.sortedServerChannels(this.serverID);
      },
      set(channels: Channel[]) {
        ServersModule.UpdateServer({
          server_id: this.serverID,
          channel_position: channels.map(c => c.channelID)
        });
      }
    },
    serverID(): any {
      return this.$route.params.server_id;
    }
  },
  mounted() {
    const { id } = this.$route.params;
    this.selectedChannelID = id || null;
    id && this.$router.replace({ params: { id: null as any } });
  },
  methods: {
    outsideClick(event: any) {
      if (event.target.classList.contains("button")) return;
      this.showContext = false;
    },
    onDragEnd() {
      const channelIDs = this.channels.map(s => s.channelID);
      updateServerChannelPosition(this.serverID, channelIDs);
    },
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
  }
});
</script>

<style lang="scss" scoped>
.ghost {
  opacity: 0;
}
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
