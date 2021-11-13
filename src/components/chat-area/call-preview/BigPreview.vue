<template>
  <div class="big-preview">
    <Avatar
      v-if="!videoStream"
      :imageId="participant.user.avatar"
      :seedId="participant.user.id"
      size="80px"
    />
    <div class="stream" v-else>
      <video class="video" ref="video" autoplay :muted="isMyStream"></video>
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
import { MeModule } from "@/store/modules/me";
import { defineComponent } from "vue";
export default defineComponent({
  components: { Avatar },
  props: {
    participant: {
      type: Object as PropType<CallParticipant & { user: User }>,
      required: true,
    },
  },
  watch: {
    videoStream: {
      immediate: true,
      handler(stream) {
        if (!stream) return;
        this.$nextTick(() => {
          const video = this.$refs.video as HTMLVideoElement;
          video.srcObject = stream;
          // console.log(this.videoStream?.getVideoTracks()[0].getSettings());
        });
      },
    },
  },
  computed: {
    isMyStream() {
      return MeModule.user.id === this.participant.user.id;
    },
    videoStream(): MediaStream | null | undefined {
      if (this.isMyStream) {
        const channelId = this.$route.params.channel_id;
        const joinedChannel = voiceChannelModule.joinedChannelId;
        if (joinedChannel !== channelId) return;
        return voiceChannelModule.videoStream;
      }
      return this.participant.videoStream;
    },
  },
});
</script>

<style scoped lang="scss">
.big-preview {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  margin: 5px;
  margin-left: 0;
  display: flex;
  flex: 1;
  align-content: center;
  align-items: center;
  justify-content: center;
}
.stream {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  justify-content: center;
  overflow: hidden;
}
.video {
  width: 100%;
  height: 100%;
  border-radius: 4px;
  overflow: hidden;
}
</style>
