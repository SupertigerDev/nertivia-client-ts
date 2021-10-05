<template>
  <div class="call-template">
    <div class="username">{{ participant.user.username }}</div>
  </div>
</template>

<script lang="ts">
import User from "@/interfaces/User";
import { CallParticipant } from "@/store/modules/voiceChannels";
import { PropType } from "vue";
import { defineComponent } from "vue";
export default defineComponent({
  props: {
    participant: {
      type: Object as PropType<CallParticipant & { user: User }>,
      required: true,
    },
  },
});
</script>

<style scoped>
.call-template {
  display: flex;
  align-items: center;
  border-radius: 4px;
  height: 30px;
  padding: 5px;
}
.username {
  opacity: 0.8;
}
</style>
