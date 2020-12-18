<template>
  <div
    class="server-template"
    :class="{ noBanner: !bannerURL }"
    @mouseover="hovering = true"
    @mouseleave="hovering = false"
  >
    <div class="banner">
      <img
        loading="lazy"
        v-if="bannerURL"
        class="banner-img"
        :src="bannerURL"
      />
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
          <div class="mid-info">
            <div class="member-count" title="Total Members">
              <div class="material-icons">account_box</div>
              <span>{{ data.total_members.toLocaleString() }}</span>
            </div>
            <div class="creator" @click="showCreatorProfile">
              <div class="twemoji"><img :src="tweCrown" /></div>
              <div class="username">{{ data.creator.username }}</div>
            </div>
          </div>
        </div>
        <div class="right">
          <div class="button valid" v-if="isJoined" @click="visitClicked">
            Visit
          </div>
          <div
            class="button"
            :class="{ disabled: joining }"
            v-else
            @click="joinClicked"
          >
            {{ joining ? "Joining..." : "Join" }}
          </div>
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
import { PopoutsModule } from "@/store/modules/popouts";
import { joinServerById } from "@/services/serverService";
@Component({ components: { AvatarImage } })
export default class ExploreServerTemplate extends Vue {
  joining = false;
  hovering = false;
  tweCrown = config.twemojiLocations + "1f451.svg";
  @Prop() private data!: ServerResponse;
  showCreatorProfile() {
    PopoutsModule.ShowPopout({
      id: "profile",
      component: "profile-popout",
      data: { uniqueID: this.data.creator.uniqueID }
    });
  }
  visitClicked() {
    this.$router.push(
      `/app/servers/${this.isJoined.server_id}/${this.isJoined.default_channel_id}`
    );
  }
  joinClicked() {
    this.joining = true;
    joinServerById(this.data.server.server_id, {
      socketID: this.$socket.client.id
    }).finally(() => {
      this.joining = false;
    });
  }
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
  height: 280px;
  min-width: 300px;
  border-radius: 10px;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.3);

  position: relative;
  overflow: hidden;
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
    position: relative;
    flex: 1;
  }
}

.details {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.twemoji {
  img {
    height: 16px;
    width: 16px;
  }
  margin-right: 5px;
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
.mid-info {
  display: flex;
  align-items: center;
}
.creator {
  display: flex;
  align-items: center;
  cursor: pointer;
  opacity: 0.4;
  transition: 0.2s;
  &:hover {
    opacity: 1;
  }
}
.username {
  color: white;
}
.member-count {
  margin-bottom: 5px;
  display: flex;
  align-items: center;
  opacity: 0.4;
  font-size: 14px;
  .material-icons {
    font-size: 19px;
    margin-right: 3px;
  }
  span {
    padding-right: 5px;
    margin-right: 5px;
    border-right: solid 1px white;
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
  &.valid {
    background: #6c36ff;
  }
  &.disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}
.avatar {
  position: absolute;
  top: -30px;
}
</style>
