<template>
  <div class="message-loading animate">
    <div class="center-box">
      <img class="spinner" src="../assets/spinner.svg" alt="" />
      <div class="title">{{ $t("connection.loading") }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "LoadingScreen",
});
</script>

<style lang="scss" scoped>
.message-loading {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.center-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: center;
}
.animate {
  animation: animate 1s;
  animation-iteration-count: infinite;
  animation-fill-mode: both;
  animation-direction: alternate;
}
.spinner {
  height: 100px;
  width: auto;
}
@keyframes animate {
  from {
    background: rgba(0, 0, 0, 0);
  }
  to {
    background: rgba(0, 0, 0, 0.3);
  }
}
</style>
