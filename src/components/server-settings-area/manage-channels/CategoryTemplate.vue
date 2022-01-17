<template>
  <div class="category">
    <div class="title">
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
        :id="`category-${category.channelID}`"
        @end="onEnd"
        v-model="channels"
        item-key="channelID"
      >
        <template #item="{ element }">
          <ChannelTemplate v-if="element.type === 1" :channel="element" />
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
export default defineComponent({
  name: "CategoryTemplate",
  components: { ChannelTemplate, Draggable },
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
        return ChannelsModule.sortedServerChannels(this.serverID).filter(
          (channel) => channel.categoryId === this.category.channelID
        );
      },
      set(channels: Channel[]) {
        // ServersModule.UpdateServer({
        //   server_id: this.serverID,
        //   channel_position: channels.map((c) => c.channelID),
        // });
      },
    },
    serverID(): any {
      return this.$route.params.server_id;
    },
  },
  methods: {
    onEnd(event: any) {
      if (event.from !== event.to) {
        console.log("de-nested");
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.dragArea {
  min-height: 50px;
  outline: 1px dashed;
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
