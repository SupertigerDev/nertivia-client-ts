<template>
  <div class="notification">
    <div class="description">Change your notification settings. WIP.</div>
    <div class="box">
      <Checkbox v-model="notificationSound" name="Notification Sound" />
      <Checkbox v-model="desktopNotification" name="Desktop Notification" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Checkbox from "@/components/Checkbox.vue";

@Component({ components: { Checkbox } })
export default class Notification extends Vue {
  notificationSound = false;
  desktopNotification = true;
}
</script>

<style lang="scss" scoped>
.notification {
  display: flex;
  flex-direction: column;
}
.description {
  opacity: 0.7;
  margin: 5px;
}
.title {
  margin-bottom: 5px;
}
.box {
  padding: 10px;
  align-self: flex-start;
  margin-left: 5px;
}
</style>
