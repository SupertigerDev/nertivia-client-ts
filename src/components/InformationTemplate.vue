<template>
  <div class="information">
    <div class="description">
      <div class="material-icons">info</div>
      {{ title }}
    </div>
    <div class="notice">
      {{ information }}
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "ProfilePopout",
  props: {
    title: {
      type: String,
      required: true,
    },
    information: {
      type: String,
      required: false,
    },
  },
});
</script>
<style lang="scss" scoped>
.description {
  display: flex;
  align-items: center;
  align-content: center;
  .material-icons {
    margin-right: 5px;
  }
}
.notice {
  color: rgba(255, 255, 255, 0.6);
  margin-left: 30px;
}
</style>
