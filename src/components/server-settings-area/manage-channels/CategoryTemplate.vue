<template>
  <div class="category">
    <div class="title">
      <div class="material-icons icon">segment</div>
      {{ category.name }}
      <div class="material-icons icon arrow">keyboard_arrow_right</div>
    </div>
    <div class="channel-list">
      <Draggable
        :animation="200"
        :delay="$isMobile ? 400 : 0"
        ghost-class="ghost"
        class="dragArea"
        @end="onEnd"
        v-model="categoryChannels"
        item-key="channelID"
      >
        <template #item="{ element }">
          <div class="test">
            <ChannelTemplate v-if="element.type === 1" :channel="element" />
          </div>
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
export default defineComponent({
  name: "CategoryTemplate",
  components: { ChannelTemplate, Draggable },
  props: {
    category: {
      type: Object as PropType<Channel>,
      required: true,
    },
  },
  methods: {
    onEnd() {
      console.log("ended");
    },
  },
  computed: {
    categoryChannels() {
      return [];
    },
  },
});
</script>

<style lang="scss" scoped>
.dragArea {
  max-width: 20rem;
  margin: 0;
}
.category {
  display: flex;
  flex-direction: column;
  user-select: none;
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
