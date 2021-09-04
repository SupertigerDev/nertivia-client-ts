<template>
  <div class="call-preview">
    <SmallCallPreview :participants="participants" />
  </div>
</template>

<script lang="ts">
import { CallParticipant } from "@/store/modules/voiceChannels";
import Vue, { PropType } from "vue";
import SmallCallPreview from "./SmallCallPreview.vue";
import ExpandedCallPreview from "./ExpandedCallPreview.vue";
export default Vue.extend({
  components: { SmallCallPreview },
  props: {
    participants: Array as PropType<CallParticipant[]>
  }
});
</script>

<style scoped></style>
