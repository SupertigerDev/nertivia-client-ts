<template>
  <div
    class="server"
    :class="{ selected: isServerSelected }"
    @click="serverClicked"
    @mouseover="hover = true"
    @mouseout="hover = false"
  >
    <AvatarImage
      size="50px"
      :imageId="server.avatar"
      :seedId="server.server_id"
      :animateGif="hover"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import AvatarImage from "@/components/AvatarImage.vue";
import Server from "@/interfaces/Server";

@Component({ components: { AvatarImage } })
export default class MainApp extends Vue {
  @Prop() private server!: Server;
  hover = false;

  serverClicked() {
    this.$router.push(
      `/app/servers/${this.server.server_id}/${this.server.default_channel_id}`
    );
  }

  get isServerSelected() {
    return this.$route.params.server_id === this.server.server_id;
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/global.scss";
.server {
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
  width: 70px;
  height: 60px;
  content-visibility: auto;
  contain-intrinsic-size: 60px;
  user-select: none;
  cursor: pointer;

  &::after {
    content: "";
    position: absolute;
    top: 20px;
    bottom: 20px;
    left: 0;
    transition: 0.1s;
    width: 2px;
  }

  &:hover::after {
    background: $primary-color;
    opacity: 0.7;
  }
  &.selected::after {
    background: $primary-color;
    opacity: 1;
    top: 10px;
    width: 3px;
    bottom: 10px;
  }
}
</style>
