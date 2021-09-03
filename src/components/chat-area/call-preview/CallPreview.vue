<template>
  <div class="call-preview">
    <CallTemplate
      v-for="participant in participants"
      :key="participant.user.id"
      :participant="participant"
    />
  </div>
</template>

<script lang="ts">
import { CallParticipant } from "@/store/modules/call";
import Vue, { PropType } from "vue";
import CallTemplate from "./CallTemplate.vue";
export default Vue.extend({
  components: { CallTemplate },
  props: {
    participants: Array as PropType<CallParticipant[]>,
  },
});
</script>

<style scoped>
.call-preview {
  display: flex;
  background: rgb(44, 44, 44);
}

</style>
