<template>
  <div class="header">
    <img class="logo" src="@/assets/logo.svg" alt />
    <div class="title">Nertivia</div>
    <div class="logged-in" v-if="token">
      <img class="spinner" src="@/assets/spinner.svg" v-if="!user" />
      <AvatarImage
        :imageId="user.avatar"
        :seedId="user.id"
        v-if="user"
        :animateGif="true"
        :willHaveClickEvent="true"
        @click="openContext = !openContext"
        size="50px"
      />
      <HomeHeaderContext class="context" v-if="openContext" />
    </div>
    <div class="buttons" v-if="!token">
      <a href="/login" class="button">Log In</a>
      <div class="button join" @click="registerButton">Join Nertivia</div>
    </div>
  </div>
</template>
<script>
import { getUser } from "@/services/userService";
import AvatarImage from "@/components/AvatarImage.vue";
import HomeHeaderContext from "@/components/popouts/HomeHeaderContext.vue";

export default {
  components: { AvatarImage, HomeHeaderContext },
  data() {
    return {
      token: localStorage["hauthid"],
      user: null,
      openContext: false,
    };
  },
  methods: {
    registerButton() {
      this.$router.push("/register");
    },
  },
  mounted() {
    if (!this.token) return;
    getUser()
      .then(({ user }) => {
        this.user = user;
      })
      .catch((err) => {
        if (!err.response) {
          alert(this.$t("could-not-connect-to-server"));
          return;
        }
        localStorage.clear();
        this.token = null;
      });
  },
};
</script>

<style scoped lang="scss">
.fall-down-fast-enter-active,
.fall-down-fast-leave-active {
  transition: 0.2s;
}
.fall-down-fast-enter-from, .fall-down-fast-leave-to /* .fade-leave-active below version 2.1.8 */ {
  transform: translateY(-20px);
  opacity: 0;
}

.header {
  display: flex;
  height: 60px;
  width: 100%;
  align-content: center;
  align-items: center;
  flex-shrink: 0;
}
.buttons {
  display: flex;
  margin: auto;
  margin-right: 10px;
}
.logged-in {
  display: flex;
  margin: auto;
  margin-right: 10px;
  position: relative;
  flex-direction: column;
  align-items: flex-end;
  flex: 1;
  .spinner {
    height: 50px;
    width: 50px;
  }
  .context {
    top: 50px !important;
    left: initial !important;
    margin-top: 10px;
  }
}
.button {
  padding: 10px;
  border-radius: 4px;
  color: rgba(87, 160, 255, 1);
  text-decoration: none;
  user-select: none;
  margin: 5px;
  cursor: pointer;
  &.join {
    box-shadow: 0 0 5px 0 black;
    color: white;
    background: var(--primary-color);
    transition: 0.2s;
    &:hover {
      opacity: 0.8;
    }
  }
}
.profile {
  margin: auto;
  margin-right: 20px;
  display: flex;
  align-items: center;
  align-content: center;
  position: relative;
  .avatar {
    margin-right: 10px;
  }
  .details {
    font-size: 14px;
  }
  .tag {
    opacity: 0.7;
  }
}
.logo {
  margin-left: 20px;
  margin-right: 10px;
  height: 50px;
  width: 50px;
}
@media (max-width: 300px) {
  .logo {
    display: none;
  }
  .title {
    display: none;
  }
  .profile {
    margin: auto;
  }
}
</style>
