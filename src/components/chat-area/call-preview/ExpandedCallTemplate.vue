<template>
  <div class="call-template" :class="{ selected }">
    <Avatar
      :imageId="participant.user.avatar"
      :seedId="participant.user.id"
      size="25px"
    />
    <div class="username">{{ participant.user.username }}</div>
    <div class="icons">
      <div v-if="sharingScreen" class="material-icons">tv</div>
      <div class="material-icons" v-if="streamingAudio">mic</div>
      <div class="material-icons alert" v-if="!streamingAudio">mic_off</div>

    </div>
  </div>
</template>

<script lang="ts">
import User from "@/interfaces/User";
import {
  CallParticipant,
  voiceChannelModule,
} from "@/store/modules/voiceChannels";
import { PropType } from "vue";
import Avatar from "@/components/AvatarImage.vue";
import { defineComponent } from "vue";
import { MeModule } from "@/store/modules/me";
export default defineComponent({
  components: { Avatar },
  props: {
    selected: Boolean,
    participant: {
      type: Object as PropType<CallParticipant & { user: User }>,
      required: true,
    },
  },
  computed: {
    sharingScreen() {
      if (this.participant.user.id === MeModule.user.id) {
        return voiceChannelModule.videoStream;
      }
      return this.participant.videoStream;
    },
    streamingAudio() {
      if (this.participant.user.id === MeModule.user.id) {
        return voiceChannelModule.audioStream;
      }
      return this.participant.audioStream;
    },
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
.icons {
  display: flex;
  margin-left: auto;
  margin-right: 3px;
  .alert {
    color: var(--alert-color)
  }
}
.username {
  opacity: 0.8;
  margin-left: 3px;
}
</style>
