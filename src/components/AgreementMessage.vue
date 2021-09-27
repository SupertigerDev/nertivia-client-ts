<template>
  <div class="agree-message">
    {{ prefix }} you are agreeing to the
    <a href="/terms-and-conditions" target="_blank" rel="noopener noreferrer"
      >Terms and conditions</a
    >
    and the
    <a href="/privacy" target="_blank" rel="noopener noreferrer"
      >Privacy policy</a
    >
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "AgreementMessage",
  props: {
    prefix: {
      type: String,
      required: true,
    },
  },
});
</script>
<style scoped>
.agree-message {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
}
</style>
