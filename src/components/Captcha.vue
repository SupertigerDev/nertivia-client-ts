<template>
  <h-captcha :sitekey="sitekey" theme="dark" ref="recaptcha" @verify="submit" />
</template>

<script lang="js">
import hCaptcha from "@hcaptcha/vue-hcaptcha";
import Vue from "vue";

export default {
  components: { hCaptcha },
  data() {
    return {
      sitekey: process.env.VUE_APP_CAPTCHA_SITE_KEY
    };
  },

  methods: {
    submit(response) {
      this.$emit("verify", response);
    },
    resetRecaptcha() {
      this.$refs.recaptcha.reset(); // Direct call reset method
    }
  }
};
</script>
