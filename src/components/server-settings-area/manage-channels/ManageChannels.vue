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
        :channelId="selectedChannelID"
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
          :items="contextItems"
          :pos="{ x: 15, y: 110 }"
          @itemClick="onContextClick"
        />
        <div class="channel-list">
          <Draggable
            :group="{ name: 'g1' }"
            class="dragArea"
            :animation="200"
            :delay="$isMobile ? 400 : 0"
            ghost-class="ghost"
            v-model="channels"
            @end="onDragEnd"
            item-key="channelId"
          >
            >
            <template #item="{ element }">
              <div class="templates">
                <ChannelTemplate
                  v-if="element.type === 1 && !element.categoryId"
                  :channel="element"
                  @click="selectedChannelID = element.channelId"
                />
                <CategoryTemplate
                  v-if="element.type === 2"
                  :category="element"
                  @click="selectedChannelID = $event"
                />
              </div>
            </template>
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
import CategoryTemplate from "./CategoryTemplate.vue";
import { ChannelsModule } from "@/store/modules/channels";
import ContextMenu from "@/components/ContextMenu.vue";
import SelectedChannelPage from "./SelectedChannelPage.vue";
import {
  createServerChannel,
  updateServerChannelPosition,
} from "@/services/channelService";
import Channel from "@/interfaces/Channel";

import { defineComponent } from "vue";
export default defineComponent({
  name: "ManageChannels",
  components: {
    CustomButton,
    ChannelTemplate,
    CategoryTemplate,
    ContextMenu,
    SelectedChannelPage,
    Draggable,
  },
  data() {
    return {
      showContext: false,
      selectedChannelID: null as string | null,
      createRequestSent: false,
      contextItems: [
        {
          name: this.$t("server-settings.manage-channels.text-channel"),
          icon: "textsms",
          id: "text-channel",
        },
        {
          name: this.$t("server-settings.manage-channels.category-channel"),
          icon: "segment",
          id: "category-channel",
        },
        {
          name: this.$t("server-settings.manage-channels.html-channel"),
          icon: "code",
          disabled: true,
          id: "html-channel",
        },
      ],
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
          channel_position: channels.map((c) => c.channelId),
        });
      },
    },
    serverID(): any {
      return this.$route.params.server_id;
    },
  },
  mounted() {
    const { id } = this.$route.params as { [key: string]: string };
    this.selectedChannelID = id || null;
    id && this.$router.replace({ params: { id: null as any } });
  },
  methods: {
    onContextClick(item) {
      if (item.id === "text-channel") {
        this.createChannel(1);
      }
      if (item.id === "category-channel") {
        this.createChannel(2);
      }
    },
    outsideClick(event: any) {
      if (event.target.classList.contains("button")) return;
      this.showContext = false;
    },
    onDragEnd(event: any) {
      let category: null | { id: string; channelId: string } = null;
      if (event.from !== event.to) {
        category = {
          id: event.to.id.split("-")[1],
          channelId: this.channels[event.oldIndex].channelId,
        };
      }
      const channelIDs = this.channels.map((s) => s.channelId);
      updateServerChannelPosition(this.serverID, channelIDs, category);
    },
    createChannel(type = 1) {
      this.showContext = false;
      if (this.createRequestSent) return;
      const name = type === 1 ? "New Channel" : "New Category";
      this.createRequestSent = true;
      createServerChannel(this.serverID, name, type)
        .then((json) => {
          ChannelsModule.AddChannel(json.channel);
          this.selectedChannelID = json.channel.channelId;
        })
        .finally(() => {
          this.createRequestSent = false;
        });
    },
  },
});
</script>

<style lang="scss" scoped>
.dragArea {
  min-height: 50px;
  padding-bottom: 35px;
  // outline: 1px dashed;
}
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
