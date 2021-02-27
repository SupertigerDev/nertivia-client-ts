<template>
  <div class="channel" :class="{ selected }">
    <div class="dot" />
    <div class="name">{{ item.name }}</div>
  </div>
</template>

<script lang="ts">
import Channel from "@/interfaces/Channel";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

@Component
export default class ChannelSuggestionTemplate extends Vue {
  @Prop() private item!: Channel;
  @Prop() private selected!: boolean;
}
</script>
<style scoped lang="scss">
.channel {
  display: flex;
  align-items: center;
  align-content: center;
  height: 25px;
  cursor: pointer;
  user-select: none;
  color: rgba(255, 255, 255, 0.6);
  &.selected {
    background: var(--primary-color);
    color: white;
    .dot {
      background: white;
    }
  }
}
.dot {
  height: 7px;
  width: 7px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  margin-right: 5px;
  margin-left: 5px;
}
.name {
  margin-right: 5px;
}
</style>
