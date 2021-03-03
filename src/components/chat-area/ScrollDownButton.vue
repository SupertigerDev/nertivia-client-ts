<template>
  <div class="background">
    <div class="button animate-in" :class="{ alert: hasNotification }" >
      <div class="material-icons icon">arrow_downward</div>
      {{ hasNotification ? "New Messages" : "Back To Bottom" }}
    </div>
  </div>
</template>

<script lang="ts">
import { LastSeenServerChannelsModule } from "@/store/modules/lastSeenServerChannel";
import { Component, Vue } from "vue-property-decorator";

@Component
export default class ScrollDownButton extends Vue {
  get hasNotification() {
    return LastSeenServerChannelsModule.serverChannelNotification(
      this.channelID
    );
  }
  get channelID() {
    return this.$route.params.channel_id;
  }
}
</script>

<style lang="scss" scoped>
.background {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  height: 70px;
  right: 0;
  top: -80px;
  left: 0px;
  pointer-events: none;
  z-index: 999999999;
  overflow: hidden;
}
.button {
  display: flex;
  align-items: center;
  align-content: center;
  border-radius: 20px;
  background: var(--primary-color);
  cursor: pointer;
  user-select: none;
  font-size: 14px;
  padding: 10px;
  pointer-events: all;
  transition: 0.2s;
  box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.7);
  &.alert {
    background: var(--alert-color);
  }
  &:hover {
    opacity: 0.7;
  }
  .icon {
    margin-right: 5px;
  }
}

.animate-in {
  opacity: 0;
  animation: showUp 0.2s;
  animation-fill-mode: forwards;
}
@keyframes showUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
