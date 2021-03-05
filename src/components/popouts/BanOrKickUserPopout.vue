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
            <div class="buttons">
              <div class="button" @click="close">Back</div>
              <div
                class="button warn"
                @click="buttonClicked"
                :class="{ disabled: requestSent }"
              >
                <span>{{ data.action === "BAN" ? "Ban" : "Kick" }}</span>
                <span>{{ requestSent ? "ing..." : "" }}</span>
              </div>
            </div>
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
import { kickMember, banMember } from "@/services/serverService";
import User from "@/interfaces/User";
@Component({
  components: { AvatarImage }
})
export default class ProfilePopout extends Vue {
  requestSent = false;
  @Prop() private data!: {
    uniqueID: string;
    serverID: string;
    action: string;
    tempUser: User;
  };
  close() {
    PopoutsModule.ClosePopout("ban-or-kick-user-popout");
  }
  backgroundClick(event: any) {
    if (event.target.classList.contains("popout-background")) {
      this.close();
    }
  }
  buttonClicked() {
    this.requestSent = true;
    const fun = this.data.action === "BAN" ? banMember : kickMember;
    fun(this.data.serverID, this.data.uniqueID)
      .then(() => {
        this.close();
      })
      .catch(err => {
        this.requestSent = false;
      });
  }

  get user() {
    return UsersModule.users[this.data.uniqueID] || this.data.tempUser || {};
  }
}
</script>
<style lang="scss" scoped>
.ban-or-kick-popout {
  background: var(--popout-color);
  border-radius: 4px;
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
.buttons {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  align-content: center;
  justify-content: center;
}
.button {
  background: var(--primary-color);
  margin: 10px;
  border-radius: 4px;
  padding: 8px;
  font-size: 18px;
  cursor: pointer;
  user-select: none;
  opacity: 0.8;
  transition: 0.2s;
  &:hover {
    opacity: 1;
  }
  &.warn {
    background: var(--alert-color);
  }
  &.disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}
</style>
