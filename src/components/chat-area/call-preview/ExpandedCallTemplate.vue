<template>
  <div class="call-template" :class="{ selected }">
    <Avatar
      :imageId="participant.user.avatar"
      :seedId="participant.user.id"
      size="25px"
    />
    <div class="username">{{ participant.user.username }}</div>
    <div v-if="participant.videoStream" class="video-streaming material-icons">
      tv
    </div>
  </div>
</template>

<script lang="ts">
import User from "@/interfaces/User";
import { CallParticipant } from "@/store/modules/voiceChannels";
import { PropType } from "vue";
import Avatar from "@/components/AvatarImage.vue";
import { defineComponent } from "vue";
export default defineComponent({
  components: { Avatar },
  props: {
    selected: Boolean,
    participant: Object as PropType<CallParticipant & { user: User }>,
  },
});
</script>

<style scoped lang="scss">
.call-template {
  display: flex;
  align-items: center;
  border-radius: 4px;
  height: 30px;
  padding: 2px;
  background: rgba(0, 0, 0, 0.2);
  cursor: pointer;
  &:hover {
    background: rgba(0, 0, 0, 0.4);
  }
  &.selected {
    background: rgba(0, 0, 0, 0.8);
    .username {
      opacity: 1;
    }
  }
}
.video-streaming {
  margin-left: auto;
  margin-right: 3px;
}
.username {
  opacity: 0.8;
  margin-left: 3px;
}
</style>
