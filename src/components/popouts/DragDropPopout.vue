<template>
  <div class="popout-background">
    <div class="drag-n-drop">
      <div class="content animate-in">
        <div class="material-icons icon">insert_drive_file</div>
        <div class="desc">Drop file.</div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "ProfilePopout",
});
</script>
<style lang="scss" scoped>
.drag-n-drop {
  background: var(--popout-color);
  border-radius: 4px;
  width: 200px;
  height: 200px;
}
.animate-in {
  opacity: 0;
  animation: showUp 0.2s;
  animation-fill-mode: forwards;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 100%;
}
.icon {
  font-size: 60px;
  margin-bottom: 20px;
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

.popout-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.658);
  z-index: 99999999999999999999999999999;
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: center;
  pointer-events: all;
}
</style>
