<template>
  <h-captcha :sitekey="sitekey" theme="dark" ref="recaptcha" @verify="submit" />
</template>

<script lang="ts">
import hCaptcha from "@jdinabox/vue-3-hcaptcha";
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  emits: ["verify"],
  components: { hCaptcha },
  data() {
    return {
      sitekey: process.env.VUE_APP_CAPTCHA_SITE_KEY,
    };
  },

  methods: {
    submit(response) {
      this.$emit("verify", response);
    },
    resetRecaptcha() {
      (this.$refs.recaptcha as any).reset(); // Direct call reset method
    },
  },
});
</script>
