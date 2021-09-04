<template>
  <div class="call-preview">
    <div class="icon material-icons">call</div>

    <div class="text">In Call:</div>
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
    participants: Array as PropType<CallParticipant[]>
  }
});
</script>

<style scoped>
.text {
  font-weight: bold;
}
.call-preview {
  display: flex;
  align-content: center;
  height: 30px;
  align-items: center;
  background: rgb(44, 44, 44);
}
.icon {
  font-size: 18px;
  margin-right: 5px;
  margin-left: 5px;
}
</style>
