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
          @click="selecteduserId = participant.user.id"
          :key="participant.user.id"
          :participant="participant"
          :selected="
            selectedParticipant &&
            selectedParticipant.user.id === participant.user.id
          "
        />
      </div>
      <div class="actions">
        <div
          class="button material-icons"
          :class="{ alert: !emittingVoice }"
          @click="toggleMic"
          title="Mute/Unmute Mic"
        >
          {{ emittingVoice ? "mic" : "mic_off" }}
        </div>
        <div
          class="button material-icons"
          title="Call Settings"
          @click="settingsClicked"
        >
          settings
        </div>
        <div
          class="button material-icons"
          @click="shareScreen"
          title="Share Screen"
          v-if="isInCall"
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
    <BigPreview
      class="big-preview"
      v-if="selectedParticipant"
      :key="selectedParticipant.user.id"
      :participant="selectedParticipant"
    />
  </div>
</template>

<script lang="ts">
import User from "@/interfaces/User";
import {
  CallParticipant,
  voiceChannelModule,
} from "@/store/modules/voiceChannels";
import { PropType } from "vue";
import CallTemplate from "./ExpandedCallTemplate.vue";
import BigPreview from "./BigPreview.vue";
import { joinCall, leaveCall } from "@/services/voiceService";
import { PopoutsModule } from "@/store/modules/popouts";
import { defineComponent } from "vue";
import router from "@/router";
export default defineComponent({
  components: { CallTemplate, BigPreview },
  props: {
    participants: {
      type: Array as PropType<(CallParticipant & { user: User })[]>,
      required: true,
    },
  },
  data() {
    return {
      selecteduserId: this.participants[0].user.id,
    };
  },
  methods: {
    toggleMic() {
      voiceChannelModule.toggleMic();
    },
    settingsClicked() {
      router.push("/app/settings/call-options");
    },
    onCallClicked() {
      PopoutsModule.ShowPopout({
        id: "call-ip-leak-warning",
        component: "generic-popout",
        data: {
          callback: () => this.joinCall(),
          title: "P2P Calling Notice",
          description:
            "Because of the nature of P2P, your IP will be able to be seen by other participants on the call.",
        },
      });
    },
    async joinCall() {
      await leaveCall();
      voiceChannelModule.join({
        channelId: this.channelId,
      });
      joinCall(this.channelId);
    },

    async leaveCall() {
      await leaveCall();
      this.$emit("toggleExpand");
    },
    async shareScreen() {
      PopoutsModule.ShowPopout({
        id: "screenshare-popout",
        component: "ScreensharePopout",
      });
    },
  },
  computed: {
    emittingVoice() {
      return voiceChannelModule.audioStream;
    },
    selectedParticipant(): (CallParticipant & { user: User }) | undefined {
      return this.participants.find((p) => p.user.id === this.selecteduserId);
    },
    channelId(): string {
      return this.$route.params.channel_id as string;
    },
    isInCall(): boolean {
      return this.channelId === voiceChannelModule.joinedChannelId;
    },
  },
});
</script>

<style scoped lang="scss">
.call-preview-expanded {
  position: relative;
  display: flex;
  height: 100%;
}

.left {
  display: flex;
  flex-direction: column;
  max-width: 300px;
  flex: 1;
}
.actions {
  display: flex;
  gap: 15px;
  align-items: center;
  justify-content: center;
  margin-block: 5px;
  user-select: none;
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
@media (max-width: 1220px) {
  .call-preview-expanded {
    flex-direction: column;
    overflow: auto;
  }
  .big-preview {
    max-height: calc(100% - 65px);
  }
  .left {
    order: 2;
    max-width: initial;
    .participant-list {
      order: 2;
    }
  }
}
</style>
