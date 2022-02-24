<template>
  <div class="category">
    <div class="title" @click="$emit('click', category.channelId)">
      <div class="material-icons icon">segment</div>
      {{ category.name }}
      <div class="material-icons icon arrow">keyboard_arrow_right</div>
    </div>
    <div class="channel-list">
      <Draggable
        :group="{ name: 'g1' }"
        :animation="200"
        :delay="$isMobile ? 400 : 0"
        ghost-class="ghost"
        class="dragArea"
        :id="`category-${category.channelId}`"
        @end="onEnd"
        v-model="channels"
        item-key="channelId"
      >
        <template #item="{ element }">
          <ChannelTemplate
          @click="$emit('click', element.channelId)"
            v-if="
              element.type === 1 && element.categoryId === category.channelId
            "
            :channel="element"
          />
        </template>
      </Draggable>
    </div>
  </div>
</template>
<script lang="ts">
import Draggable from "vuedraggable";

import Channel from "@/interfaces/Channel";
import { PropType } from "vue";
import { defineComponent } from "vue";
import ChannelTemplate from "./ChannelTemplate.vue";
import { ChannelsModule } from "@/store/modules/channels";
import { ServersModule } from "@/store/modules/servers";
import { updateServerChannelPosition } from "@/services/channelService";
export default defineComponent({
  name: "CategoryTemplate",
  components: { ChannelTemplate, Draggable },
  emits: ["click"],
  data() {
    return {
      categoryChannels: [],
    };
  },
  props: {
    category: {
      type: Object as PropType<Channel>,
      required: true,
    },
  },
  computed: {
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
  methods: {
    onEnd(event: any) {
      let category: null | { id: string| null; channelId: string } = null;

      if (event.from !== event.to) {
        category = {
          channelId: event.item.id.split("-")[1],
          id: event.to.id.split("-")[1],
        };
      }
      const channelIDs = this.channels.map((s) => s.channelId);
      updateServerChannelPosition(this.serverID, channelIDs, category);
    },
  },
});
</script>

<style lang="scss" scoped>
.dragArea {
  border-radius: 4px;
  background-color: rgba(0, 0, 0, 0.2);
  padding: 5px;
  padding-bottom: 35px;
}
.channel-list {
  padding-left: 30px;
}
.category {
  display: flex;
  flex-direction: column;
  user-select: none;
  margin-bottom: 10px;
}
.title {
  display: flex;
  border-radius: 4px;
  padding: 5px;
  align-items: center;
  align-content: center;
  color: rgba(255, 255, 255, 0.7);
  transition: background 0.2s, color 0.2s;
  cursor: pointer;
  &:hover {
    color: white;
    .icon {
      color: white;
    }
  }
}
.icon {
  margin: 0;
  margin-right: 5px;
  margin-left: -5px;
  transition: 0.2s;
  color: rgba(255, 255, 255, 0.199);
}
.arrow {
  margin: auto;
  margin-right: 5px;
  transition: 0.2s;
  color: rgba(255, 255, 255, 0.199);
}
</style>
