<template>
  <div class="overview">
    <Stats />
    <div class="content">
      <Users />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import Stats from "./Stats.vue";
import Users from "./Users.vue";

@Component({ components: { Stats, Users } })
export default class Overview extends Vue {}
</script>

<style lang="scss" scoped>
.overview {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex: 1;
}
.content {
  display: flex;
  overflow: hidden;
}
</style>
