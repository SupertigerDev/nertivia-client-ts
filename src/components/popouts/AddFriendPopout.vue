<template>
  <div class="popout-background" @click="backgroundClick">
    <div class="add-friend-popout">
      <div class="content animate-in">
        <div class="header">
          <div class="icon material-icons">person_add</div>
          <div class="text">{{ $t("dm-tab.add-friend") }}</div>
        </div>
        <div class="inner-content">
          <div class="info">
            {{ $t("add-friend-popout.notice") }}
          </div>
          <customInput
            class="input"
            v-model="usernameAndTag"
            placeholder="username:tag"
            title="Username And Tag"
            type="text"
            :error="error"
            :validMessage="success"
          />
          <CustomButton
            :name="
              requestSent
                ? $t('add-friend-popout.adding')
                : $t('dm-tab.add-friend')
            "
            @click="sendRequest"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { PopoutsModule } from "@/store/modules/popouts";
import CustomInput from "@/components/CustomInput.vue";
import CustomButton from "@/components/CustomButton.vue";
import { sendFriendRequest } from "@/services/relationshipService";

import { defineComponent } from "vue";
export default defineComponent({
  name: "ProfilePopout",
  components: { CustomInput, CustomButton },
  data() {
    return {
      error: null as string | null,
      success: null as string | null,
      requestSent: false,
      usernameAndTag: "",
    };
  },
  methods: {
    close() {
      PopoutsModule.ClosePopout("add-friend");
    },
    sendRequest() {
      if (this.requestSent) return;
      this.requestSent = true;
      this.error = null;
      this.success = null;
      // validate username and tag
      const split = this.usernameAndTag.trim().split(":");
      if (!this.usernameAndTag.trim().length) {
        this.error = "Cannot be friends with emptiness.";
        this.requestSent = false;
        return;
      }
      if (split.length === 1) {
        this.error = "Tag is required.";
        this.requestSent = false;
        return;
      }
      if (split.length >= 3) {
        this.error = "Username must not contain a colon.";
        this.requestSent = false;
        return;
      }
      if (!split[split.length - 1].length) {
        this.error = "Tag is required.";
        this.requestSent = false;
        return;
      }
      const username = split[0].trim();
      const tag = split[1].trim();
      sendFriendRequest(username, tag)
        .then(() => {
          this.success = "Friend request send!";
          this.requestSent = false;
        })
        .catch(async (err) => {
          this.requestSent = false;
          const json = await err.response.json();
          if (json?.errors?.[0]) {
            this.error = json.errors[0].msg;
          } else {
            this.error = "Something weng wrong. Show console to fishie.";
            console.log({ json, response: err.response });
          }
        });
    },
    backgroundClick(event: any) {
      if (event.target.classList.contains("popout-background")) {
        this.close();
      }
    },
  },
});
</script>
<style lang="scss" scoped>
.add-friend-popout {
  background: var(--popout-color);
  border-radius: 4px;
  overflow: hidden;
  max-width: 300px;
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
    margin-left: 4px;
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
  margin-top: 10px;
}
.button {
  margin-bottom: 20px;
}
.info {
  padding: 10px;
  margin-bottom: 10px;
}
</style>
