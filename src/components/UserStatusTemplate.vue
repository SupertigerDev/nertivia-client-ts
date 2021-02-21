<template>
  <div class="custom-and-presence" v-if="presence">
    <div class="presence-color" :style="{ backgroundColor: presence.color }" />
    <div class="custom-status" v-if="customStatus">{{ customStatus }}</div>
    <div class="custom-status" v-else>{{ presence.name }}</div>
  </div>
</template>

<script lang="ts">
import userStatuses from "@/constants/userStatuses";
import { CustomStatusesModule } from "@/store/modules/memberCustomStatus";
import { PresencesModule } from "@/store/modules/presences";
import { Component, Prop, Vue } from "vue-property-decorator";
@Component
export default class UserStatusTemplate extends Vue {
  @Prop() private uniqueID!: string;
  get presence() {
    const presence = PresencesModule.getPresence(this.uniqueID);
    if (!presence) return undefined;
    return userStatuses[presence || 0];
  }
  get customStatus() {
    return CustomStatusesModule.customStatus[this.uniqueID];
  }
}
</script>
<style lang="scss" scoped>
.custom-status {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 12px;
  opacity: 0.6;
}
.custom-and-presence {
  display: flex;
  align-items: center;
  align-content: center;
}
.presence-color {
  height: 10px;
  width: 10px;
  margin-right: 5px;
  border-radius: 50%;
  flex-shrink: 0;
}
</style>
