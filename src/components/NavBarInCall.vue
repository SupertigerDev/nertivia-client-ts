<template>
  <div class="in-call">
    <div class="avatar" @click="goToChannel">
      <AvatarImage
        size="40px"
        :imageId="server.avatar"
        :seedId="server.server_id"
      />
      <div class="material-icons call-icon">call</div>
    </div>
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
import router from "@/router";
import { ChannelsModule } from "@/store/modules/channels";
import { ServersModule } from "@/store/modules/servers";
import { voiceChannelModule } from "@/store/modules/voiceChannels";
import { defineComponent, computed } from "vue";
import AvatarImage from "./AvatarImage.vue";
export default defineComponent({
  components: { AvatarImage },
  setup() {
    const channel = computed(() => {
      const channelId = voiceChannelModule.joinedchannelId as string;
      return ChannelsModule.channels[channelId];
    });
    const server = computed(() => {
      const serverId = channel.value.server_id as string;
      return ServersModule.servers[serverId];
    });

    const sharingScreen = computed(() => voiceChannelModule.videoStream);
    const streamingAudio = computed(() => voiceChannelModule.audioStream);

    const toggleMic = () => voiceChannelModule.toggleMic();
    const turnOffScreenshare = () => voiceChannelModule.removeVideoStream();
    const endCall = () => voiceChannelModule.leave();
    const goToChannel = () =>
      router.push(
        `/app/servers/${channel.value.server_id}/${channel.value.channelId}`
      );

    return {
      server,
      sharingScreen,
      streamingAudio,
      toggleMic,
      turnOffScreenshare,
      endCall,
      goToChannel,
    };
  },
});
</script>

<style lang="scss" scoped>
.in-call {
  display: flex;
  flex-direction: column;
  background-color: rgba(0, 0, 0, 0.4);
  border-radius: 8px;
}
.avatar {
  padding: 1px;
  position: relative;
  cursor: pointer;
  .call-icon {
    position: absolute;
    top: 25px;
    color: var(--success-color);
  }
}
.icons {
  display: flex;
  margin-top: 10px;
  flex-direction: column;
  align-items: center;
  align-content: center;
  flex-shrink: 0;
  div {
    height: 40px;
    cursor: pointer;
    user-select: none;
  }
  .alert {
    color: var(--alert-color);
  }
}
</style>
