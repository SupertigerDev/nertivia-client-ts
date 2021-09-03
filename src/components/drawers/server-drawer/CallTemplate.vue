<template>
  <div class="call-template">
    <div class="call material-icons">call</div>
    <div class="username">{{ participant.user.username }}</div>
  </div>
</template>

<script lang="ts">
import { CallParticipant } from "@/store/modules/call";
import Vue, { PropType } from "vue";
export default Vue.extend({
  props: {
    participant: Object as PropType<CallParticipant>,
  },
});
</script>

<style scoped>
.call-template {
  display: flex;
  align-items: center;
  padding-left: 5px;
  margin-left: 20px;
  border-radius: 4px;
  height: 30px;
  margin-right: 10px;
}
.call {
  font-size: 18px;
  margin-right: 5px;
}
</style>
