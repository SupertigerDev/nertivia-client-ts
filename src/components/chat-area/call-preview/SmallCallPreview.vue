<template>
  <div class="call-preview-small">
    <div class="icon material-icons">call</div>

    <div class="text">In Call:</div>
    <CallTemplate
      v-for="participant in participants"
      :key="participant.user.id"
      :participant="participant"
    />
    <div
      class="expand-button material-icons"
      title="Expand"
      @click="$emit('toggleExpand')"
    >
      expand_more
    </div>
  </div>
</template>

<script lang="ts">
import User from "@/interfaces/User";
import { CallParticipant } from "@/store/modules/voiceChannels";
import Vue, { PropType } from "vue";
import CallTemplate from "./SmallCallTemplate.vue";
export default Vue.extend({
  components: { CallTemplate },
  props: {
    participants: Array as PropType<(CallParticipant & { user: User })[]>,
  },
});
</script>

<style scoped lang="scss">
.text {
  font-weight: bold;
}
.expand-button {
  margin-left: auto;
  font-size: 26px;
  margin-right: 5px;
  cursor: pointer;
  opacity: 0.6;
  transition: 0.2s;
  &:hover {
    opacity: 1;
  }
}
.call-preview-small {
  display: flex;
  align-content: center;
  height: 30px;
  align-items: center;
}
.icon {
  font-size: 18px;
  margin-right: 5px;
  margin-left: 5px;
}
</style>
