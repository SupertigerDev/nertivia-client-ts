<template>
  <div
    class="server-template"
    @mouseover="hovering = true"
    @mouseleave="hovering = false"
  >
    <div class="banner">
      <img loading="lazy" class="banner-img" :src="screenshotURL" />
    </div>
    <div class="container">
      <div class="top">
        <div class="left">
          <div class="name">
            {{ data.theme.name }}
            <!-- <div class="material-icons verified" title="Verified">
              done
            </div> -->
          </div>
          <div class="mid-info">
            <div
              class="likes"
              :class="{ liked: data.liked }"
              title="Like"
              @click="likeTheme"
            >
              <div class="material-icons">favorite</div>
              <span>{{ data.likes }}</span>
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
            @click="cloneTheme"
            :name="cloning ? 'Cloning...' : 'Clone'"
          />
          <CustomButton
            class="button"
            v-if="appliedThemeID === data.id"
            @click="unapplyTheme"
            :alert="true"
            name="Unapply"
          />
          <CustomButton
            class="button"
            v-else
            @click="applyTheme"
            :valid="true"
            name="Apply"
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
import {
  applyPublicTheme,
  likeTheme,
  PublicThemeResponse,
  unlikeTheme,
} from "@/services/exploreService";
import { PopoutsModule } from "@/store/modules/popouts";
import CustomButton from "@/components/CustomButton.vue";
import { applyTheme, unapplyTheme } from "@/utils/CSSTheme";
import { createTheme } from "@/services/themeService";
import { PropType } from "vue";
import { defineComponent } from "vue";
export default defineComponent({
  name: "ExploreThemeTemplate",
  components: { CustomButton },
  props: {
    data: {
      type: Object as PropType<PublicThemeResponse>,
      required: true,
    },
    appliedThemeID: {
      type: String,
      required: false,
    },
  },
  data() {
    return {
      hovering: false,
      cloning: false,
      tweCrown: process.env.VUE_APP_TWEMOJI_LOCATION + "1f451.svg",
      likeRequest: false,
    };
  },
  computed: {
    screenshotURL(): any {
      if (!this.data.screenshot) return null;
      return process.env.VUE_APP_NERTIVIA_CDN + this.data.screenshot;
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
    async applyTheme() {
      applyTheme(this.data.id);
      this.$emit("applied");
    },
    async likeTheme() {
      if (this.likeRequest) return;
      this.likeRequest = true;
      if (this.data.liked) {
        unlikeTheme(this.data.id)
          .then(() => {
            this.$emit("unliked");
          })
          .finally(() => {
            this.likeRequest = false;
          });
        return;
      }
      likeTheme(this.data.id)
        .then(() => {
          this.$emit("liked");
        })
        .finally(() => {
          this.likeRequest = false;
        });
    },
    unapplyTheme() {
      unapplyTheme();
      this.$emit("unapplied");
    },
    async cloneTheme() {
      if (this.cloning) return;
      this.cloning = true;
      const theme = await applyPublicTheme(this.data.id);
      const name = theme.theme.name;
      const css = theme.css;
      createTheme({
        css,
        name,
        client_version: this.$lastUIBreakingVersion,
      }).finally(() => {
        this.cloning = false;
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
.right {
  display: flex;
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
.likes {
  margin-bottom: 5px;
  display: flex;
  user-select: none;
  align-items: center;
  font-size: 14px;
  cursor: pointer;
  transition: 0.2s;
  color: rgba(255, 255, 255, 0.6);
  &:hover {
    .material-icons {
      opacity: 1;
      color: var(--alert-color);
    }
  }
  &.liked {
    .material-icons {
      opacity: 1;
      color: var(--alert-color);
    }
  }
  .material-icons {
    opacity: 0.6;
    transition: 0.2s;
    font-size: 19px;
    margin-right: 3px;
  }
  span {
    padding-right: 5px;
    margin-right: 5px;
    border-right: solid 1px rgba(255, 255, 255, 0.5);
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
