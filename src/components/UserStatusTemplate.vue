<template>
  <div class="custom-and-presence" v-if="presence">
    <div
      v-if="!gameStatus"
      class="presence-color"
      :style="{ backgroundColor: presence.color }"
      :title="presence.name"
    />
    <div
      v-if="gameStatus"
      class="material-icons game-icon"
      :title="presence.name"
      :style="{ color: presence.color }"
    >
      games
    </div>
    <div
      class="status-name"
      :class="{ game: gameStatus }"
      v-if="(gameStatus || customStatus) && !showStatusOnly"
    >
      <span class="name" v-if="!gameStatus">
        <Markup :largeEmoji="false" :inline="true" :text="customStatus" />
      </span>
      <span class="status" v-if="gameStatus">{{ gameStatus.status }}</span>
      <span class="name" v-if="gameStatus">{{ gameStatus.name }}</span>
    </div>

    <div class="status-name" v-else>
      {{ presence.name }}
    </div>
  </div>
</template>

<script lang="ts">
import userStatuses from "@/constants/userStatuses";
import { CustomStatusesModule } from "@/store/modules/memberCustomStatus";
import { programActivitiesModule } from "@/store/modules/memberProgramActivity";
import { PresencesModule } from "@/store/modules/presences";
import Markup from "@/components/Markup";

import { defineComponent } from "vue";
export default defineComponent({
  name: "UserStatusTemplate",
  components: { Markup },
  props: {
    id: {
      type: String,
      required: true,
    },
    showStatusOnly: {
      type: Boolean,
      required: false,
    },
    showOffline: {
      type: Boolean,
      required: false,
    },
  },
  computed: {
    presence(): any {
      const presence = PresencesModule.getPresence(this.id);
      if (!this.showOffline && !presence) return undefined;
      return userStatuses[presence || 0];
    },
    customStatus(): any {
      return CustomStatusesModule.customStatus[this.id];
    },
    gameStatus(): any {
      return programActivitiesModule.programActivity[this.id];
    },
  },
});
</script>
<style lang="scss" scoped>
.status-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 14px;
  opacity: 0.6;
  &.game {
    .status {
      margin-right: 3px;
      opacity: 0.7;
    }
    .name {
      font-weight: bold;
    }
  }
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
.game-icon {
  flex-shrink: 0;
  font-size: 14px;
  margin-right: 5px;
}
</style>
<style>
.status-name .emoji {
  height: 14px;
  width: 14px;
  vertical-align: -4px;
}
</style>
