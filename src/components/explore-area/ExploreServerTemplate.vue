<template>
  <div
    class="server-template"
    :class="{ noBanner: !bannerURL }"
    @mouseover="hovering = true"
    @mouseleave="hovering = false"
  >
    <div class="banner">
      <img v-if="bannerURL" class="banner-img" :src="bannerURL" />
    </div>
    <div class="container">
      <div class="top">
        <div class="left">
          <AvatarImage
            class="avatar"
            :imageId="data.server.avatar"
            :seedId="data.server.server_id"
            size="50px"
            :animateGif="hovering"
          />
          <div class="name">{{ data.server.name }}</div>
          <div class="member-count" title="Total Members">
            <div class="material-icons">account_box</div>
            {{ data.total_members.toLocaleString() }}
          </div>
        </div>
        <div class="right">
          <div class="button" v-if="!isJoined">Join</div>
        </div>
      </div>
      <div class="details">
        <div class="description">
          {{ data.description }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import config from "@/config";
import AvatarImage from "@/components/AvatarImage.vue";
import { ServerResponse } from "@/services/exploreService";
import { Vue, Component, Prop } from "vue-property-decorator";
import { ServersModule } from "@/store/modules/servers";
@Component({ components: { AvatarImage } })
export default class ExploreServerTemplate extends Vue {
  hovering = false;
  @Prop() private data!: ServerResponse;
  get isJoined() {
    return ServersModule.servers[this.data.server.server_id];
  }
  get bannerURL() {
    if (!this.data.server.banner) return null;
    return (
      config.nertiviaCDN +
      this.data.server.banner +
      (!this.hovering ? "?type=webp" : "")
    );
  }
}
</script>

<style lang="scss" scoped>
.server-template {
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  width: 300px;
  height: 280px;
  border-radius: 10px;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.3);

  position: relative;
  overflow: hidden;
  margin: 10px;
  &:hover {
    .banner::after {
      background: rgba(0, 0, 0, 0);
    }
  }
}
.banner {
  background-position: 50%;
  background-size: cover;
  height: 100%;
  overflow: hidden;
  width: 100%;
  position: relative;
  border-radius: 10px;
  overflow: hidden;
}
.banner-img {
  object-fit: cover;
  height: 100%;
  width: 100%;
}
.banner::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  border-radius: 10px;
  bottom: 0;
  transition: 0.2s;
  background: rgba(0, 0, 0, 0.3);
}
.container {
  display: flex;
  flex-direction: column;
  height: 130px;
  flex-shrink: 0;

  backdrop-filter: blur(2px);

  padding: 5px;
}
// .noBanner {
//   .container {
//     height: 190px;
//   }
// }
.top {
  display: flex;
  .left {
    flex: 1;
  }
}

.details {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.description {
  word-break: break-word;
  overflow: auto;
  height: 100%;
  opacity: 0.7;
}
.name {
  margin-top: 20px;
  font-size: 18px;
}
.member-count {
  margin-bottom: 5px;
  display: flex;
  align-items: center;
  opacity: 0.4;
  font-size: 14px;
  .material-icons {
    font-size: 19px;
    margin-right: 5px;
  }
}
.button {
  padding: 5px;
  background: var(--primary-color);
  opacity: 0.8;
  transition: 0.2s;
  border-radius: 4px;
  padding-left: 20px;
  padding-right: 20px;
  cursor: pointer;
  &:hover {
    opacity: 1;
  }
}
.avatar {
  position: absolute;
  top: -30px;
}
</style>
