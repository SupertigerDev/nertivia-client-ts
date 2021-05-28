<template>
  <div class="popout-background" @click="backgroundClick">
    <div class="suspend-user-popout">
      <div class="content animate-in">
        <div class="header">
          <AvatarImage
            :imageId="user.avatar"
            :seedId="user.id"
            :animateGif="false"
            size="30px"
            class="avatar"
          />
          <div class="text">
            <span style="font-weight: bold">Suspend</span>
            {{ user.username }}?
          </div>
        </div>
        <div class="inner-content">
          <div class="description">
            <div class="error" v-if="error">{{ error }}</div>
            <CustomInput
              class="reason-input"
              title="Reason"
              v-model="reason"
              :textArea="true"
            />
            <CheckBox name="IP Ban WIP" :checked="true" />
            <CheckBox name="Send Email WIP" :checked="false" />
            <CustomInput
              class="password-input"
              title="Confirm Password"
              type="password"
              v-model="password"
            />
            <div class="buttons">
              <CustomButton :name="$t('back')" @click="close" />
              <!-- TODO: i18n -->
              <CustomButton
                @click="buttonClicked"
                :name="requestSent ? 'Suspending...' : 'Suspend'"
                :alert="true"
              />
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
import { PopoutsModule } from "@/store/modules/popouts";
import User from "@/interfaces/User";
import CustomButton from "@/components/CustomButton.vue";
import CustomInput from "@/components/CustomInput.vue";
import CheckBox from "@/components/CheckBox.vue";
import { suspendUser } from "@/services/adminService";

@Component({
  components: { AvatarImage, CustomButton, CustomInput, CheckBox }
})
export default class ProfilePopout extends Vue {
  reason = "Violating the TOS.";
  password = "";
  requestSent = false;
  error: string | null = null;
  @Prop() private data!: {
    id: string;
    serverID: string;
    user: User;
  };
  close() {
    PopoutsModule.ClosePopout("admin-suspend-user-popout");
  }

  backgroundClick(event: any) {
    if (event.target.classList.contains("popout-background")) {
      this.close();
    }
  }
  buttonClicked() {
    if (this.requestSent) return;
    this.requestSent = true;
    this.error = null;
    suspendUser(this.data.user.id, this.password, this.reason)
      .then(() => {
        //
      })
      .catch(async err => {
        if (!err.response) {
          this.error = "Could not connect to server.";
          return;
        }
        const { message } = await err.response.json();
        this.error = message;
      })
      .finally(() => (this.requestSent = false));
  }
  get user() {
    return this.data.user;
  }
}
</script>
<style lang="scss" scoped>
.suspend-user-popout {
  background: var(--popout-color);
  border-radius: 4px;
  width: 400px;
  overflow: hidden;
  height: 430px;
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
  margin-top: 20px;
}
.password-input {
  margin-top: 20px;
}
.buttons {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  align-content: center;
  justify-content: center;
}
.error {
  color: var(--alert-color);
}
</style>

<style lang="scss">
.reason-input {
  .main-input.textarea {
    height: 100px;
  }
}
</style>
