<template>
  <div class="call-template">
    <!-- <div class="call material-icons">call</div> -->
    <Avatar
      :imageId="participant.user.avatar"
      :seedId="participant.user.id"
      size="20px"
      class="avatar"
    />
    <div class="username">{{ participant.user.username }}</div>
  </div>
</template>

<script lang="ts">
import { CallParticipant } from "@/store/modules/voiceChannels";
import Avatar from "@/components/AvatarImage.vue";
import { PropType } from "vue";
import { defineComponent } from "vue";
export default defineComponent({
  components: { Avatar },
  props: {
    participant: Object as PropType<CallParticipant>,
  },
});
</script>

<style scoped>
.call-template {
  display: flex;
  align-items: center;
  border-radius: 4px;
  height: 30px;
  margin-right: 10px;
  margin-left: -5px;
}
.username {
  opacity: 0.7;
}
.avatar {
  margin-bottom: 2px;
  margin-right: 3px;
}
.call {
  font-size: 18px;
  margin-right: 5px;
}
</style>
