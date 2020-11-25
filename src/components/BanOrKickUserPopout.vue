<template>
  <div class="popout-background" @click="backgroundClick">
    <div class="ban-or-kick-popout">
      <div class="content animate-in">
        <div class="header">
          <AvatarImage
            :imageId="user.avatar"
            :seedId="user.uniqueID"
            :animateGif="false"
            size="30px"
            class="avatar"
          />
          <div class="text">
            <span style="font-weight: bold">{{ data.action }}</span>
            {{ user.username }}?
          </div>
        </div>
        <div class="inner-content">
          <div class="description">
            Do you really want to<br />
            <span>
              <span style="font-weight: bold">{{ data.action }}</span>
              {{ user.username }}?
            </span>
            <p></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import AvatarImage from "@/components/AvatarImage.vue";
import { UsersModule } from "@/store/modules/users";
import { PopoutsModule } from "@/store/modules/popouts";
import User from "@/interfaces/User";
@Component({
  components: { AvatarImage }
})
export default class ProfilePopout extends Vue {
  @Prop() private data!: {
    uniqueID: string;
    serverID: string;
    action: string;
    tempUser: User;
  };
  backgroundClick(event: any) {
    if (event.target.classList.contains("popout-background")) {
      PopoutsModule.ClosePopout("ban-or-kick-user-popout");
    }
  }

  get user() {
    return UsersModule.users[this.data.uniqueID] || this.data.tempUser || {};
  }
}
</script>
<style lang="scss" scoped>
.ban-or-kick-popout {
  background: var(--popout-color);
  border-radius: 8px;
  width: 300px;
  overflow: hidden;
  height: 200px;
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
.header {
  display: flex;
  align-items: center;
  align-content: center;
  padding: 5px;
  background: var(--main-header-bg-color);
  .text {
    margin-left: 10px;
  }
}
.content {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.inner-content {
  display: flex;
  flex-direction: column;
  overflow: auto;
  align-items: center;
}
.description {
  margin-top: 40px;
  text-align: center;
}
</style>
