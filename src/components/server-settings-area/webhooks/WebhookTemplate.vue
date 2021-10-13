<template>
  <div class="webhook">
    {{ webhook?.name }}
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "@vue/runtime-core";
import Webhook from "@/interfaces/Webhook";

export default defineComponent({
  props: {
    webhook: Object as PropType<Webhook>,
  },
});
</script>
