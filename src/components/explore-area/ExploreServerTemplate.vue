<template>
  <div
    class="server-template"
    :style="{ backgroundImage: `url(${bannerURL})` }"
  >
    <div class="container">
      <div class="details">
        <div class="name">{{ data.server.name }}</div>
        <div class="description">{{ data.description }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import config from "@/config";
import { ServerResponse } from "@/services/exploreService";
import { Vue, Component, Prop } from "vue-property-decorator";
@Component
export default class ExploreServerTemplate extends Vue {
  @Prop() private data!: ServerResponse;
  get bannerURL() {
    return config.nertiviaCDN + this.data.server.banner;
  }
}
</script>

<style lang="scss" scoped>
.server-template {
  width: 300px;
  height: 200px;
  background: rgba(0, 0, 0, 0.6);
  background-position: 50%;
  background-size: cover;
  border-radius: 10px;
  position: relative;
  overflow: hidden;
  margin: 10px;
}

.container {
  top: 100px;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(2px);
  position: absolute;
  left: 0;
  right: 0;
  padding: 5px;
  bottom: 0;
  overflow: hidden;
}
.details {
  word-break: break-word;
  overflow: auto;
  height: 100%;
}
.name {
  margin-bottom: 5px;
  font-size: 18px;
}
.description {
  opacity: 0.8;
}
</style>
