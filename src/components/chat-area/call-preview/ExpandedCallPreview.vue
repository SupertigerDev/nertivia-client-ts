<template>
  <div class="call-preview-expanded">
    <div
      class="expand-button material-icons"
      title="Expand"
      @click="$emit('toggleExpand')"
    >
      expand_more
    </div>
    <div class="left">
      <div class="participant-list">
        <CallTemplate
          v-for="(participant, i) in participants"
          @click.native="selecteduserIndex = i"
          :key="participant.user.id"
          :participant="participant"
          :selected="
            participants[selecteduserIndex].user.id === participant.user.id
          "
        />
      </div>
      <div class="actions">
        <div class="button material-icons" title="Voice Settings">settings</div>
        <div
          class="button material-icons"
          @click="shareScreen"
          title="Share Screen"
        >
          screen_share
        </div>
        <div class="button material-icons alert" title="End Call">call_end</div>
      </div>
    </div>
    <BigPreview :participant="participants[selecteduserIndex]" />
  </div>
</template>

<script lang="ts">
import User from "@/interfaces/User";
import {
  CallParticipant,
  voiceChannelModule
} from "@/store/modules/voiceChannels";
import Vue, { PropType } from "vue";
import CallTemplate from "./ExpandedCallTemplate.vue";
import BigPreview from "./BigPreview.vue";
export default Vue.extend({
  components: { CallTemplate, BigPreview },
  props: {
    participants: Array as PropType<(CallParticipant & { user: User })[]>
  },
  data() {
    return {
      selecteduserIndex: 0
    };
  },
  methods: {
    async shareScreen() {
      const mediaDevices = navigator.mediaDevices as any;
      const stream = await mediaDevices.getDisplayMedia({ video: true });
      // stream to all peers
      const joinedChannelId = voiceChannelModule.joinedChannelId;
      const voiceChannelPeers =
        voiceChannelModule.voiceChannelUsers[joinedChannelId || ""];
      if (!voiceChannelPeers) return;
      Object.values(voiceChannelPeers).forEach(p => {
        p.peer?.addStream(stream);
      });
    }
  }
});
</script>

<style scoped lang="scss">
.call-preview-expanded {
  position: relative;
  display: flex;
  height: 250px;
}
.big-preview {
  flex: 1;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  margin: 5px;
  margin-left: 0;
}
.left {
  display: flex;
  flex-direction: column;
}
.actions {
  display: flex;
  gap: 15px;
  align-items: center;
  justify-content: center;
  margin-block: 5px;
}
.button {
  opacity: 0.8;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.2);
  padding: 10px;
  transition: 0.2s;
  cursor: pointer;
  &.alert {
    color: var(--alert-color);
  }
  &:hover {
    opacity: 1;
  }
}
.participant-list {
  display: flex;
  gap: 5px;
  flex-direction: column;
  height: 100%;
  width: 300px;
  margin: 5px;
}
.text {
  font-weight: bold;
}
.expand-button {
  position: absolute;
  right: 10px;
  top: 12px;
  font-size: 26px;
  cursor: pointer;
  opacity: 0.6;
  transition: 0.2s;
  &:hover {
    opacity: 1;
  }
}
.icon {
  font-size: 18px;
  margin-right: 5px;
  margin-left: 5px;
}
</style>
