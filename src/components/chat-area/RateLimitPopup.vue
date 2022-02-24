<template>
  <div class="ratelimit-popup" :title="rateLimitDuration">
    <div class="immune" v-if="isImmune" />
    <div class="material-icons icon">query_builder</div>
    <div class="text" v-if="!timeLeft">
      {{ $t("chat-area.rate-limit-mode") }}
    </div>
    <div class="text" v-if="timeLeft">{{ timeLeft }}</div>
  </div>
</template>

<script lang="ts">
import { permissions } from "@/constants/rolePermissions";
import { ChannelsModule } from "@/store/modules/channels";
import { MeModule } from "@/store/modules/me";
import { ServerMembersModule } from "@/store/modules/serverMembers";
import { ServersModule } from "@/store/modules/servers";

import { defineComponent } from "vue";
export default defineComponent({
  name: "RateLimitPopup",
  data() {
    return {
      timeLeft: "",
      interval: null as any,
    };
  },
  computed: {
    rateLimitDuration(): any {
      const value = ChannelsModule.channels[this.channelId].rateLimit || 0;
      return this.timeConversion(value * 1000);
    },
    rateTimeLeft(): any {
      const now = Date.now();
      return ChannelsModule.rateLimitTimeLeft(this.channelId, now);
    },
    channelId(): any {
      return this.$route.params.channel_id;
    },
    serverID(): any {
      return this.$route.params.server_id;
    },
    isImmune(): any {
      if (!MeModule.user.id) return false;
      if (ServersModule.isServerOwner(this.serverID, MeModule.user.id))
        return true;
      return ServerMembersModule.memberHasPermission(
        MeModule.user.id,
        this.serverID,
        permissions.ADMIN.value
      );
    },
  },
  watch: {
    rateTimeLeft: {
      handler: "onRateLimit",
    },
  },
  beforeUnmount() {
    clearInterval(this.interval);
  },
  mounted() {
    this.calculate();
    this.interval = setInterval(this.calculate, 500);
  },
  methods: {
    calculate() {
      // TODO: i18n of ratelimit time
      const now = Date.now();
      const timeLeft = ChannelsModule.rateLimitTimeLeft(this.channelId, now);
      if (this.isImmune || isNaN(timeLeft) || timeLeft <= 0) {
        clearInterval(this.interval);
        this.interval = null;
        this.timeLeft = "";
        return;
      }
      this.timeLeft = this.timeConversion(timeLeft);
    },
    timeConversion(millisec: number) {
      const seconds = (millisec / 1000).toFixed(0) as any;
      const minutes = (millisec / (1000 * 60)).toFixed(1) as any;
      const hours = (millisec / (1000 * 60 * 60)).toFixed(1) as any;

      if (seconds < 60) {
        return seconds + " seconds";
      } else if (minutes < 60) {
        return minutes + " minutes";
      } else {
        return hours + " hours";
      }
    },
    onRateLimit() {
      this.calculate();
      if (this.interval) return;
      this.interval = setInterval(this.calculate, 500);
    },
  },
});
</script>

<style lang="scss" scoped>
.ratelimit-popup {
  position: absolute;
  bottom: 2px;
  right: 2px;
  display: flex;
  align-content: center;
  align-items: center;
  font-size: 12px;
  background: var(--card-color);
  border-radius: 4px;
  border: solid 1px rgba(255, 255, 255, 0.1);
  padding: 5px;
  color: rgba(255, 255, 255, 0.7);
  opacity: 0.8;
  z-index: 1111111111;
  user-select: none;
  cursor: default;
}
.immune {
  left: 24px;
  right: 5px;
  height: 2px;
  background: white;
  position: absolute;
}
.icon {
  margin-right: 5px;
  font-size: 14px;
}
</style>
