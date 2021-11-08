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
    <div class="icons">
      <div v-if="sharingScreen" class="material-icons">tv</div>
      <div class="material-icons" v-if="streamingAudio">mic</div>
      <div class="material-icons alert" v-if="!streamingAudio">mic_off</div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  CallParticipant,
  voiceChannelModule,
} from "@/store/modules/voiceChannels";
import Avatar from "@/components/AvatarImage.vue";
import { PropType } from "vue";
import { defineComponent } from "vue";
import User from "@/interfaces/User";
import { MeModule } from "@/store/modules/me";
export default defineComponent({
  components: { Avatar },
  props: {
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

<style lang="scss" scoped>
.call-template {
  display: flex;
  align-items: center;
  border-radius: 4px;
  height: 30px;
  margin-right: 10px;
  margin-left: -5px;
}
.icons {
  display: flex;
  margin-left: auto;
  margin-right: 3px;
  .alert {
    color: var(--alert-color);
  }
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
