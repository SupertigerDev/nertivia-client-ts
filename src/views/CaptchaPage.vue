<template>
  <div class="container">
    <Captcha @verify="onVerify" />
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import Captcha from "@/components/Captcha.vue";
export default defineComponent({
  components: { Captcha },
  methods: {
    onVerify(token) {
      (window as any).ReactNativeWebView.postMessage(token);
    },
  },
});
</script>
<style>
.container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
</style>
