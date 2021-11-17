<template>
  <div class="popout-background" @click="backgroundClick">
    <div class="suspend-user-popout">
      <div class="content animate-in">
        <div class="header">
          <AvatarImage
            v-if="!data.users"
            :imageId="user.avatar"
            :seedId="user.id"
            :animateGif="false"
            size="30px"
            class="avatar"
          />
          <div class="text">
            <span style="font-weight: bold">Suspend</span>
            {{ data.users ? "Batch" : user.username }}?
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
                :name="requestSent ? 'Suspending...' : 'Suspend Users'"
                :alert="true"
                v-if="data.users"
              />
              <CustomButton
                v-else
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
import AvatarImage from "@/components/AvatarImage.vue";
import { PopoutsModule } from "@/store/modules/popouts";
import User from "@/interfaces/User";
import CustomButton from "@/components/CustomButton.vue";
import CustomInput from "@/components/CustomInput.vue";
import CheckBox from "@/components/CheckBox.vue";
import { suspendUser } from "@/services/adminService";
import { PropType } from "vue";
import { defineComponent } from "vue";
export default defineComponent({
  name: "ProfilePopout",
  components: { AvatarImage, CustomButton, CustomInput, CheckBox },
  props: {
    data: {
      type: Object as PropType<{
        id: string;
        serverID: string;
        user: User;
        users: User[];
        callback: any;
      }>,
      required: true,
    },
  },
  data() {
    return {
      reason: "Violating the TOS.",
      password: "",
      requestSent: false,
      error: null as string | null,
    };
  },
  computed: {
    user(): any {
      return this.data.user;
    },
  },
  methods: {
    close() {
      PopoutsModule.ClosePopout("admin-suspend-user-popout");
    },
    backgroundClick(event: any) {
      if (event.target.classList.contains("popout-background")) {
        this.close();
      }
    },
    buttonClicked() {
      if (this.requestSent) return;
      this.requestSent = true;
      this.error = null;
      if (this.data.users) {
        this.suspendBatch();
        return;
      }
      suspendUser(this.data.user.id, this.password, this.reason)
        .then(() => {
          this.data.callback();
          this.close();
        })
        .catch(async (err) => {
          if (!err.response) {
            this.error = "Could not connect to server.";
            return;
          }
          const { message } = await err.response.json();
          this.error = message;
        })
        .finally(() => (this.requestSent = false));
    },
    suspendBatch(index = 0) {
      const id = this.data.users[index].id;
      suspendUser(id, this.password, this.reason)
        .then(() => {
          this.data?.callback?.(this.data.users[index]);
          if (index + 1 === this.data.users.length) {
            this.close();
            return;
          }
          this.suspendBatch(index + 1);
        })
        .catch(async (err) => {
          this.requestSent = false;
          if (!err.response) {
            this.error = "Could not connect to server.";
            return;
          }
          const { message } = await err.response.json();
          this.error = message;
        });
    },
  },
});
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
  height: 41px;
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
