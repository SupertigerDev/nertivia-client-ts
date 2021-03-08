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
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class ProfilePopout extends Vue {
  @Prop() private title!: string;
  @Prop() private information!: string;
}
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
