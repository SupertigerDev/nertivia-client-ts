<template>
  <div class="call-preview" :class="{ expand: expanded }">
    <transition name="component-fade" appear mode="out-in">
      <component
        :is="!expanded ? 'SmallCallPreview' : 'ExpandedCallPreview'"
        :participants="participants"
        @toggleExpand="toggleExpand"
      />
    </transition>
  </div>
</template>

<script lang="ts">
import {
  CallParticipant,
  voiceChannelModule,
} from "@/store/modules/voiceChannels";
import { PropType } from "vue";
import SmallCallPreview from "./SmallCallPreview.vue";
import ExpandedCallPreview from "./ExpandedCallPreview.vue";
import { defineComponent } from "vue";
export default defineComponent({
  components: { SmallCallPreview, ExpandedCallPreview },
  props: {
    participants: Array as PropType<CallParticipant[]>,
  },
  data() {
    return {
      expanded: localStorage["call-preview-expanded"] === "true",
    };
  },
  methods: {
    setExpanded(state: boolean) {
      localStorage["call-preview-expanded"] = state;
      this.expanded = state;
    },
    toggleExpand() {
      this.setExpanded(!this.expanded);
    },
  },
  watch: {
    joinedVoiceChannelId: {
      handler(id) {
        if (id) {
          this.setExpanded(true);
        } else {
          this.setExpanded(false);
        }
      },
      immediate: true,
    },
  },
  computed: {
    joinedVoiceChannelId(): string | null {
      return voiceChannelModule.joinedChannelId;
    },
  },
});
</script>

<style scoped>
.component-fade-enter-active,
.component-fade-leave-active {
  transition: opacity 0.4s ease;
}
.component-fade-enter-from,
.component-fade-leave-to {
  opacity: 0;
}

.call-preview {
  transition: height 0.5s, background 0.5s;
  height: 30px;
  flex-shrink: 0;
  background: var(--side-header-bg-color);
  overflow: hidden;
}
.expand {
  height: 60%;
  background: var(--card-color);
}
</style>
