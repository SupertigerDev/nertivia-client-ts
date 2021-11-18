<template>
  <div class="typing-status-box">
    <CustomButton
      class="button"
      name="Deselect All"
      icon="check_box_outline_blank"
    />
    <CustomButton class="button" name="Select All" icon="check_box" />
    <CustomButton class="button" name="Delete Selected" icon="delete" alert />
    <div class="selected-count">10 Selected</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import CustomButton from "../CustomButton.vue";
export default defineComponent({
  components: { CustomButton },
  data() {
    return {
      //
    };
  },
});
</script>
<style lang="scss" scoped>
.typing-status-box {
  display: flex;
  align-items: center;
  background: var(--typing-status-bg-color);
  height: 40px;
  z-index: 999999999;
  overflow: hidden;
}
.selected-count {
  margin-left: 10px;
}
.button {
  padding: 5px;
}

.animate-container {
  display: flex;
  align-items: center;
  opacity: 0;
  animation: showUp 0.2s;
  overflow: hidden;
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
