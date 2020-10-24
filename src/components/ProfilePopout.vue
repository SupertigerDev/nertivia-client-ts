<template>
  <div class="popout-background">
    <div class="profile-popout">
      <div class="top">
        <div class="avatar-area">
          <AvatarImage
            :imageId="user.avatar"
            :seedId="user.uniqueID"
            :animateGif="true"
            size="80px"
            class="avatar"
          />
          <div class="user">
            <span class="username">{{ user.username }}</span>
            <span class="tag">:{{ user.tag }}</span>
          </div>
        </div>
      </div>
      <div class="details">
        <div class="left">
          <div class="custom-status">
            <div
              class="dot"
              :style="{ background: presence.color }"
              :title="presence.name"
            />
            <div class="name">{{ customStatus || presence.name }}</div>
          </div>
        </div>
        <div class="right">
          <div class="button">
            <div class="material-icons">person_add</div>
            Send Message
          </div>
          <div class="button green">
            <div class="material-icons">message</div>
            Add Friend
          </div>
          <div class="button alert">
            <div class="material-icons">block</div>
            Block
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import AvatarImage from "@/components/AvatarImage.vue";
import { MeModule } from "@/store/modules/me";
import { PresencesModule } from "@/store/modules/presences";
import userStatuses from "@/constants/userStatuses";
import { fetchUser, ReturnedUser } from "@/services/userService";
import { UsersModule } from "@/store/modules/users";
@Component({
  components: { AvatarImage }
})
export default class ProfilePopout extends Vue {
  @Prop() private uniqueID!: string;
  returnedUser: ReturnedUser | null = null;

  mounted() {
    fetchUser(this.uniqueID).then(user => {
      this.returnedUser = user;
    });
  }

  get presence() {
    if (!this.user?.uniqueID) return userStatuses[0];
    const presence = PresencesModule.getPresence(this.user.uniqueID);
    return userStatuses[presence || 0];
  }
  get customStatus() {
    if (this.presence.name === "Offline") return undefined;
    if (this.user?.uniqueID === MeModule.user.uniqueID) {
      return MeModule.user.custom_status;
    }
    return undefined;
  }
  get user() {
    if (!this.returnedUser) {
      return UsersModule.users[this.uniqueID];
    }
    return this.returnedUser?.user;
  }
}
</script>
<style lang="scss" scoped>
.profile-popout {
  background: #222933;
  border-radius: 8px;
  width: 450px;
  height: 600px;
}
.top {
  background: var(--primary-color);
  width: 100%;
  height: 110px;
  border-radius: 8px;
  position: relative;
}
.avatar-area {
  position: absolute;
  display: flex;
  flex-direction: column;

  bottom: -50px;
  left: 20px;
  .user {
    margin-top: 10px;
    font-size: 18px;
  }
  .tag {
    font-size: 16px;
    opacity: 0.7;
  }
}
.details {
  display: flex;
  border-bottom: solid 1px rgba(255, 255, 255, 0.2);
  padding-bottom: 5px;
  flex-shrink: 0;
  .left {
    display: flex;
    margin-top: 60px;
    flex: 1;
  }
  .right {
    display: flex;
    margin-top: 5px;
    flex-direction: column;
    margin-right: 20px;
  }
}
.custom-status {
  display: flex;
  align-items: center;
  border-radius: 12px;
  margin-left: 20px;
  background: rgba(255, 255, 255, 0.1);
  align-self: flex-start;
  padding: 4px;
  padding-left: 6px;
  padding-right: 8px;
  .dot {
    background: green;
    height: 10px;
    margin-right: 8px;
    border-radius: 50%;
    width: 10px;
  }
}
.button {
  display: flex;
  align-items: center;
  background: var(--primary-color);
  align-self: flex-end;
  border-radius: 4px;
  font-size: 14px;
  padding: 5px;
  margin: 4px;
  cursor: pointer;
  transition: 0.2s;
  user-select: none;
  &.alert {
    background: var(--alert-color);
  }
  &:hover {
    opacity: 0.8;
  }
  .material-icons {
    font-size: 18px;
    margin-right: 5px;
  }
  &:active {
    transform: scale(0.9);
  }
}
.popout-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.658);
  z-index: 99999999999999999999999999999;
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: center;
  pointer-events: all;
}
</style>
