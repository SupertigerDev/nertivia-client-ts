<template>
  <div
    class="mini-profile"
    :style="clampPos"
    :key="user.uniqueID"
    v-click-outside="clickOutside"
  >
    <div class="content animate-in">
      <div class="top">
        <div class="avatar-area">
          <AvatarImage
            size="80px"
            :imageId="user.avatar"
            :seedId="user.uniqueID"
            @click.native="openFullProfile"
            :willHaveClickEvent="true"
            :animateGif="true"
          />
          <div class="username">{{ user.username }}</div>
        </div>
      </div>
      <div class="status"><UserStatusTemplate :uniqueID="user.uniqueID" /></div>
      <div class="bottom">
        <div class="title" v-if="roles.length">
          <span class="material-icons">clear_all</span> Roles
        </div>
        <div class="roles">
          <div class="role" v-for="role in roles" :key="role.id">
            <div class="dot" :style="{ background: role.color }" />
            {{ role.name }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import AvatarImage from "@/components/AvatarImage.vue";
import User from "@/interfaces/User";
import ServerRole from "@/interfaces/ServerRole";
import userStatuses from "@/constants/userStatuses";
import UserStatusTemplate from "@/components/UserStatusTemplate.vue";
import { PresencesModule } from "@/store/modules/presences";
import WindowProperties from "@/utils/windowProperties";
import { PopoutsModule } from "@/store/modules/popouts";
import { CustomStatusesModule } from "@/store/modules/memberCustomStatus";
import Markup from "@/components/Markup.vue";

interface ServerMember {
  member: User;
  roles: ServerRole[];
}

@Component({ components: { AvatarImage, Markup, UserStatusTemplate } })
export default class MiniProfilePopout extends Vue {
  @Prop() private data!: { x: number; y: number; member: ServerMember };
  height = 0;
  width = 0;
  clickOutside() {
    PopoutsModule.ClosePopout("profile");
  }
  mounted() {
    this.height = this.$el.clientHeight;
    this.width = this.$el.clientWidth;
  }
  openFullProfile() {
    PopoutsModule.ShowPopout({
      id: "profile",
      component: "profile-popout",
      data: { uniqueID: this.user?.uniqueID }
    });
  }
  get presence() {
    if (!this.user?.uniqueID) return userStatuses[0];
    const presence = PresencesModule.getPresence(this.user.uniqueID);
    return userStatuses[presence || 0];
  }
  get customStatus() {
    if (!this.user) return undefined;
    return CustomStatusesModule.customStatus[this.user.uniqueID];
  }
  get user() {
    return this.data.member.member;
  }
  get roles() {
    return this.data.member.roles;
  }
  get clampPos() {
    let top = this.data.y || 0;
    const left = this.data.x - 260 || 0;

    // prevent from going left of the screen
    const clampedLeft = this.clamp(left, 0, left);
    if (clampedLeft === 0) {
      top += 50;
    }
    // prevent from going bottom of the screen
    const heightPos = this.height + top;
    const clampedTop =
      this.clamp(heightPos, 0, this.windowDiamentions.height) - this.height;

    return {
      top: clampedTop + "px",
      left: clampedLeft + "px"
    };
  }

  get windowDiamentions() {
    return {
      height: WindowProperties.resizeHeight,
      width: WindowProperties.resizeWidth
    };
  }
  clamp(num: number, min: number, max: number) {
    return num <= min ? min : num >= max ? max : num;
  }
}
</script>
<style lang="scss" scoped>
.mini-profile {
  display: flex;
  flex-direction: column;
  position: absolute;
  height: 300px;
  width: 250px;
  overflow: hidden;
  background: var(--card-color);
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.6);

  pointer-events: all;
  border-radius: 8px;
}
.content {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.animate-in {
  opacity: 0;
  animation: showUp 0.2s;
  animation-fill-mode: forwards;
}
@keyframes showUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.top {
  border-radius: 8px;
  height: 100px;
  background: var(--primary-color);
}
.avatar-area {
  padding-top: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  .username {
    margin-top: 5px;
  }
}
.title {
  display: flex;
  align-items: center;
  align-content: center;
  margin-left: 5px;
  .material-icons {
    margin-right: 5px;
    opacity: 0.7;
  }
}
.roles {
  display: flex;
  flex-wrap: wrap;
  margin-left: 5px;
}
.role {
  display: flex;
  align-content: center;
  align-items: center;
  margin: 2px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 4px;
  padding-left: 5px;
  padding-right: 7px;
  .dot {
    height: 10px;
    width: 10px;
    background: white;
    border-radius: 50%;
    margin-right: 5px;
  }
}
.custom-status {
  word-wrap: break-word;
  word-break: break-word;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  font-size: 14px;
  margin-left: 5px;
  margin-right: 5px;
  margin-top: 5px;
  margin-bottom: 5px;
  color: rgba(255, 255, 255, 0.6);
}
.status {
  display: flex;
  align-items: center;
  align-self: center;
  border-radius: 12px;
  max-width: 80%;
  margin-top: 40px;
  background: rgba(255, 255, 255, 0.1);
  padding: 4px;
  margin-bottom: 10px;
  padding-left: 6px;
  padding-right: 8px;
  .name {
    word-wrap: break-word;
    word-break: break-word;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
  }
  .dot {
    background: green;
    height: 10px;
    margin-right: 8px;
    flex-shrink: 0;
    border-radius: 50%;
    width: 10px;
  }
}
.bottom {
  display: flex;
  flex-direction: column;
  overflow: auto;
}
</style>
<style>
.mini-profile .status-name.game {
  white-space: initial;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* number of lines to show */
  -webkit-box-orient: vertical;
}
</style>
