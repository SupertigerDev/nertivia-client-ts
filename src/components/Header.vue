<template>
  <div class="header">
    <div class="button left-drawer material-icons" @click="toggleLeftDrawer">
      menu
    </div>
    <Tabs />
    <div
      class="call-button-outer"
      v-if="isServerChannel"
      @click="onCallClicked"
      title="Call"
    >
      <div class="button call-button material-icons">call</div>
    </div>
    <div
      class="button right-drawer-button material-icons"
      v-if="isServerChannel"
      @click="toggleRightDrawer"
      title="Members list"
    >
      menu
    </div>
  </div>
</template>

<script lang="ts">
import { ChannelsModule } from "@/store/modules/channels";
import { DrawersModule } from "@/store/modules/drawers";
import { PopoutsModule } from "@/store/modules/popouts";
import { voiceChannelModule } from "@/store/modules/voiceChannels";
import Tabs from "@/components/HeaderTabs.vue";

import { joinCall, leaveCall } from "@/services/voiceService";
import { defineComponent } from "vue";
export default defineComponent({
  name: "MainApp",
  components: { Tabs },
  props: {
    title: {
      type: String,
      required: false,
    },
  },
  computed: {
    isServerChannel(): any {
      return this.$route.params.server_id;
    },
    DMChannel(): any {
      return ChannelsModule.getDMChannel(
        this.$route.params.channel_id as string
      );
    },
    DMUser(): any {
      return this.DMChannel?.recipients?.[0];
    },
    channelId(): string {
      return this.$route.params.channel_id as string;
    },
  },
  methods: {
    onCallClicked() {
      if (this.channelId === voiceChannelModule.joinedChannelId) return;
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
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      await leaveCall().catch(() => {});
      voiceChannelModule.join({
        channelId: this.channelId,
      });
      joinCall(this.channelId);
    },
    toggleLeftDrawer() {
      DrawersModule.SetLeftDrawer(true);
    },
    toggleRightDrawer() {
      DrawersModule.SetRightDrawer(!DrawersModule.rightDrawer);
    },
    showProfile() {
      if (!this.DMUser?.id) return;
      PopoutsModule.ShowPopout({
        id: "profile",
        component: "profile-popout",
        data: { id: this.DMUser.id },
      });
    },
  },
});
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  align-content: center;
  align-items: center;
  height: 40px;
  width: 100%;
  flex-shrink: 0;
  background-color: var(--main-header-bg-color);
}
.name {
  margin-left: 10px;
  &.clickable {
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
}
.call-button-outer {
  margin-left: auto;
  position: relative;
  cursor: pointer;
  &:after {
    content: "BETA";
    position: absolute;
    border-radius: 8px;
    font-size: 8px;
    top: -5px;
    left: 6px;
    padding: 3px;
    background: var(--alert-color);
  }
  &:hover {
    .button {
      opacity: 1;
    }
  }
}
.button {
  opacity: 0.7;
  transition: 0.2s;
  cursor: pointer;
  display: none;
  &.call-button {
    display: block;

    margin-right: 10px;
  }
  &.right-drawer-button {
    margin-right: 5px;
    display: block;
  }
  &:hover {
    opacity: 1;
  }
}
.status {
  margin-left: 5px;
  padding: 3px;
  border-radius: 4px;
}
.avatar {
  margin-left: 5px;
  margin-right: -5px;
}
@media (max-width: 950px) {
  .left-drawer {
    margin-left: 5px;
    display: block;
  }
}
</style>

<style lang="scss">
.header .status {
  margin-left: 5px;
  padding: 3px;
  border-radius: 4px;
  a {
    color: white;
  }
  .mention {
    color: white;
  }
}
</style>
