<template>
  <div class="custom-css">
    <div class="box">
      d
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class CustomCSS extends Vue {}
</script>

<style lang="scss" scoped>
.custom-css {
  display: flex;
  flex-direction: column;
  overflow: auto;
}

.box {
  padding: 10px;
  align-self: flex-start;
  margin-left: 5px;
}
</style>
