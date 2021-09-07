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
          v-for="participant in participants"
          @click.native="selecteduserId = participant.user.id"
          :key="participant.user.id"
          :participant="participant"
          :selected="
            selectedParticipant &&
              selectedParticipant.user.id === participant.user.id
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
        <div
          @click="onCallClicked"
          class="button material-icons valid"
          title="Join Call"
          v-if="!isInCall"
        >
          call
        </div>
        <div
          @click="leaveCall"
          class="button material-icons alert"
          title="End Call"
          v-if="isInCall"
        >
          call_end
        </div>
      </div>
    </div>
    <BigPreview v-if="selectedParticipant" :participant="selectedParticipant" />
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
import { joinCall, leaveCall } from "@/services/voiceService";
import { PopoutsModule } from "@/store/modules/popouts";
export default Vue.extend({
  components: { CallTemplate, BigPreview },
  props: {
    participants: Array as PropType<(CallParticipant & { user: User })[]>
  },
  data() {
    return {
      selecteduserId: this.participants[0].user.id
    };
  },
  methods: {
    onCallClicked() {
      PopoutsModule.ShowPopout({
        id: "call-ip-leak-warning",
        component: "generic-popout",
        data: {
          callback: () => this.joinCall(),
          title: "P2P Calling Notice",
          description:
            "Your IP address will be sent to participants of the call."
        }
      });
    },
    joinCall() {
      voiceChannelModule.leave();
      voiceChannelModule.join({
        channelId: this.channelId
      });
      joinCall(this.channelId);
    },

    async leaveCall() {
      await leaveCall();
      this.$emit("toggleExpand");
    },
    async shareScreen() {
      const mediaDevices = navigator.mediaDevices as any;
      const stream = await mediaDevices.getDisplayMedia({
        video: true,
        audio: true
      });
      voiceChannelModule.addStream({ stream, type: "video" });
    }
  },
  computed: {
    selectedParticipant(): (CallParticipant & { user: User }) | undefined {
      return this.participants.find(p => p.user.id === this.selecteduserId);
    },
    channelId(): string {
      return this.$route.params.channel_id;
    },
    isInCall(): boolean {
      return this.channelId === voiceChannelModule.joinedChannelId;
    }
  }
});
</script>

<style scoped lang="scss">
.call-preview-expanded {
  position: relative;
  display: flex;
  height: 350px;
}

.left {
  display: flex;
  flex-direction: column;
  flex: 1;
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
  &.valid {
    color: var(--success-color);
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
  margin: 5px;
}
.text {
  font-weight: bold;
}
.expand-button {
  position: absolute;
  z-index: 111111;
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
