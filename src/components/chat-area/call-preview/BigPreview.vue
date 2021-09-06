<template>
  <div class="big-preview" :class="{ selected }">
    <!-- <Avatar
      :imageId="participant.user.avatar"
      :seedId="participant.user.id"
      size="80px"
    /> -->
    <!-- <video controls autoplay ref="video" height="200" width="200"></video> -->
    <div ref="test"></div>
  </div>
</template>

<script lang="ts">
import User from "@/interfaces/User";
import { CallParticipant } from "@/store/modules/voiceChannels";
import Vue, { PropType } from "vue";
import Avatar from "@/components/AvatarImage.vue";
export default Vue.extend({
  // components: { Avatar },
  props: {
    selected: Boolean,
    participant: Object as PropType<CallParticipant & { user: User }>
  },
  watch: {
    stream: {
      immediate: true,
      handler(stream) {
        const test = this.$refs.test as HTMLDivElement;
        if (!stream) return;
        const video = document.createElement("video");

        video.srcObject = stream;
        video.autoplay = true;
        video.height = 200;
        video.width = 200;
        test.append(video);
        // const video = this.$refs.video as HTMLVideoElement;
        // video.srcObject = stream;
      }
    }
  },
  computed: {
    stream(): any {
      return this.participant.stream;
    }
  }
});
</script>

<style scoped lang="scss">
.big-preview {
  flex: 1;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  margin: 5px;
  margin-left: 0;
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: center;
}
</style>
