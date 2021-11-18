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
          <div class="name">
            {{ data.server.name }}
            <div
              class="material-icons verified"
              title="Verified"
              v-if="data.server.verified"
            >
              done
            </div>
          </div>
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
          <CustomButton
            class="button"
            v-if="isJoined"
            @click="visitClicked"
            name="Visit"
          />
          <CustomButton
            v-else
            class="button"
            @click="joinClicked"
            :valid="true"
            :disabled="joining"
            :name="joining ? 'Joining...' : 'Join'"
          />
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
import AvatarImage from "@/components/AvatarImage.vue";
import { ServerResponse } from "@/services/exploreService";
import { ServersModule } from "@/store/modules/servers";
import { PopoutsModule } from "@/store/modules/popouts";
import CustomButton from "@/components/CustomButton.vue";
import { joinServerById } from "@/services/serverService";
import { PropType } from "vue";
import { defineComponent } from "vue";
export default defineComponent({
  name: "ExploreServerTemplate",
  components: { AvatarImage, CustomButton },
  props: {
    data: {
      type: Object as PropType<ServerResponse>,
      required: true,
    },
  },
  data() {
    return {
      joining: false,
      hovering: false,
      tweCrown: process.env.VUE_APP_TWEMOJI_LOCATION + "1f451.svg",
    };
  },
  computed: {
    isJoined(): any {
      return ServersModule.servers[this.data.server.server_id];
    },
    bannerURL(): any {
      if (!this.data.server.banner) return null;
      return (
        process.env.VUE_APP_NERTIVIA_CDN +
        this.data.server.banner +
        (!this.hovering ? "?type=webp" : "")
      );
    },
  },
  methods: {
    showCreatorProfile() {
      PopoutsModule.ShowPopout({
        id: "profile",
        component: "profile-popout",
        data: { id: this.data.creator.id },
      });
    },
    visitClicked() {
      this.$router.push(
        `/app/servers/${this.isJoined.server_id}/${this.isJoined.default_channel_id}`
      );
    },
    joinClicked() {
      PopoutsModule.ShowPopout({
        id: "captcha-popout",
        component: "CaptchaPopout",
        data: {
          callback: this.captchaVerified,
        },
      });
    },
    captchaVerified(token: string) {
      this.joining = true;
      joinServerById(this.data.server.server_id, {
        socketID: this.$socket.id,
        token,
      }).finally(() => {
        this.joining = false;
      });
    },
  },
});
</script>

<style lang="scss" scoped>
.server-template {
  background: var(--card-color);
  display: flex;
  flex-direction: column;
  height: 280px;
  min-width: 299px;
  border: solid 1px rgba(255, 255, 255, 0.1);
  border-radius: 4px;
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
  border-radius: 4px;
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
  border-radius: 4px;
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
    min-width: 0;
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
  opacity: 0.8;
  font-size: 14px;
}
.name {
  margin-top: 25px;
  font-size: 18px;
}
.mid-info {
  display: flex;
  align-items: center;
  overflow: hidden;
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
  padding-left: 25px !important;
  padding-right: 25px !important;
}

.avatar {
  position: absolute;
  top: -30px;
}
.verified {
  background: var(--primary-color);
  padding: 3px;
  font-size: 14px;
  border-radius: 50%;
  cursor: default;
  user-select: none;
  flex-shrink: 0;
}
</style>
