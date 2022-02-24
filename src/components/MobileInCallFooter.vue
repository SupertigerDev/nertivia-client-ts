<template>
  <div class="mobile-in-call">
    <div class="icon material-icons">call</div>
    <MentionChannel :channel="channel" />
    <div class="icons">
      <div
        v-if="sharingScreen"
        @click="turnOffScreenshare"
        class="material-icons"
      >
        tv
      </div>
      <div class="material-icons" @click="toggleMic" v-if="streamingAudio">
        mic
      </div>
      <div
        class="material-icons alert"
        @click="toggleMic"
        v-if="!streamingAudio"
      >
        mic_off
      </div>
      <div class="material-icons alert" @click="endCall">call_end</div>
    </div>
  </div>
</template>
<script lang="ts">
import { ChannelsModule } from "@/store/modules/channels";
import MentionChannel from "@/components/markup/MentionChannel.vue";
import { voiceChannelModule } from "@/store/modules/voiceChannels";
import { computed, defineComponent } from "vue";
export default defineComponent({
  components: { MentionChannel },
  setup() {
    const channel = computed(() => {
      const channelId = voiceChannelModule.joinedChannelId as string;
      return ChannelsModule.channels[channelId];
    });

    const sharingScreen = computed(() => voiceChannelModule.videoStream);
    const streamingAudio = computed(() => voiceChannelModule.audioStream);

    const toggleMic = () => voiceChannelModule.toggleMic();
    const turnOffScreenshare = () => voiceChannelModule.removeVideoStream();
    const endCall = () => voiceChannelModule.leave();

    return {
      channel,
      sharingScreen,
      streamingAudio,
      toggleMic,
      turnOffScreenshare,
      endCall
    };
  },
});
</script>
<style lang="scss" scoped>
.mobile-in-call {
  display: flex;
  height: 40px;
  align-items: center;
  flex-shrink: 0;
}
.icon {
  margin-left: 5px;
  margin-right: 5px;
  color: var(--success-color);
}
.icons {
  display: flex;
  margin-left: auto;
  margin-right: 3px;
  flex-shrink: 0;
  div {
    width: 30px;
    cursor: pointer;
    user-select: none;
  }
  .alert {
    color: var(--alert-color);
  }
}
</style>
