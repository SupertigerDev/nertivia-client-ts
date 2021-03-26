<template>
  <div class="ratelimit-popup">
    <div class="material-icons icon">query_builder</div>
    <div class="text" v-if="!timeLeft">Rate Limit Mode</div>
    <div class="text" v-if="timeLeft">{{ timeLeft }}</div>
  </div>
</template>

<script lang="ts">
import { ChannelsModule } from "@/store/modules/channels";
import { Component, Vue, Watch } from "vue-property-decorator";

@Component
export default class RateLimitPopup extends Vue {
  timeLeft = "";
  interval: any = null;

  mounted() {
    this.interval = setInterval(this.calculate, 500);
  }
  beforeDestroy() {
    clearInterval(this.interval);
  }
  calculate() {
    this.timeLeft = this.timeConversion(this.rateTimeLeft);
  }
  timeConversion(millisec: number) {
    const seconds = (millisec / 1000).toFixed(1) as any;
    const minutes = (millisec / (1000 * 60)).toFixed(1) as any;
    const hours = (millisec / (1000 * 60 * 60)).toFixed(1) as any;

    if (seconds < 60) {
      return seconds + " seconds";
    } else if (minutes < 60) {
      return minutes + " minutes";
    } else {
      return hours + " hours";
    }
  }

  get rateTimeLeft() {
    const now = Date.now();
    return ChannelsModule.rateLimitTimeLeft(this.channelID, now);
  }
  get channelID() {
    return this.$route.params.channel_id;
  }
}
</script>

<style lang="scss" scoped>
.ratelimit-popup {
  position: absolute;
  bottom: 10px;
  right: 10px;
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
  pointer-events: none;
}
.icon {
  margin-right: 5px;
  font-size: 14px;
}
</style>
