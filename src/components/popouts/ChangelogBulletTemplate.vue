<template>
  <div class="bullets">
    <div class="bullet" v-for="(bullet, i) in list" :key="i">
      <div class="material-icons icon" :style="{ color }">{{ icon }}</div>
      {{ bullet }}
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
@Component
export default class ChangelogBullets extends Vue {
  @Prop() private bullets!: string[] | string;
  @Prop() private icon!: string;
  @Prop() private color!: string;
  get list() {
    if (typeof this.bullets === "string") return [this.bullets];
    return this.bullets;
  }
}
</script>
<style lang="scss" scoped>
.bullets {
  margin-top: 5px;
  margin-bottom: 5px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
}
.bullet {
  display: flex;
  align-items: center;
  align-content: center;
}
.icon {
  margin-right: 5px;
  font-size: 25px;
}
</style>
