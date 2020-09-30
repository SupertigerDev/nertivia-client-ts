<template>
  <div class="header">
    <img class="logo" src="@/assets/logo.svg" alt />
    <div class="title">Nertivia</div>
    <div class="buttons">
      <a href="/login" class="button">Log In</a>
      <div class="button join" @click="$emit('register-button')">
        Join Nertivia
      </div>
    </div>
    <!-- <div class="profile" v-if="loggedIn">
      <div class="details" v-if="loggedIn && user">
        <div class="username">{{ user.username }}</div>
        <div class="tag">:{{ user.tag }}</div>
      </div> -->
    <!-- <transition name="fall-down-fast">
        <profile-popout
          v-if="user && loggedIn && showProfilePopout"
          v-click-outside="closeProfilePopout"
          :user="user"
          @logout="
            loggedIn = null;
            user = null;
          "
        />
      </transition>
    </div> -->
  </div>
</template>

<style scoped lang="scss">
.fall-down-fast-enter-active,
.fall-down-fast-leave-active {
  transition: 0.2s;
}
.fall-down-fast-enter, .fall-down-fast-leave-to /* .fade-leave-active below version 2.1.8 */ {
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
@media (max-width: 374px) {
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
