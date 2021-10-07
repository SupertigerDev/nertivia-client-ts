<template>
  <div class="container">
    <Captcha />
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import Captcha from "@/components/Captcha.vue";
export default defineComponent({
  components: { Captcha },
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
