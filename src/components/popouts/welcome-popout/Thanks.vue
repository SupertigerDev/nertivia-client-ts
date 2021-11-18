<template>
  <div class="thanks">
    <div class="info">Thanks for trying out Nertivia!</div>
    <div class="card">
      <img class="image" src="@/assets/logo.svg" />
      <div class="side">
        <div class="details">Join the official Nertivia server.</div>
        <CustomButton
          name="Join Server"
          icon="chat"
          @click="joinNertiviaServer"
        />
      </div>
    </div>
    <div class="card">
      <img class="image github" src="@/assets/github-logo.svg" />
      <div class="side">
        <div class="details">
          Nertivia is open source. Check out the source code on Github.
        </div>
        <a
          href="https://github.com/supertiger1234"
          target="_blank"
          rel="noopener noreferrer"
        >
          <CustomButton name="Visit Github" icon="open_in_new" />
        </a>
      </div>
    </div>
    <div class="card">
      <img class="image" src="@/assets/kofi-logo.png" />
      <div class="side">
        <div class="details">Support me on Ko-fi</div>
        <a
          href="https://ko-fi.com/nertivia"
          target="_blank"
          rel="noopener noreferrer"
        >
          <CustomButton name="Visit Ko-fi" icon="open_in_new" />
        </a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import CustomButton from "@/components/CustomButton.vue";
import { joinServerByCode } from "@/services/serverService";
import { PopoutsModule } from "@/store/modules/popouts";

export default defineComponent({
  components: { CustomButton },
  data() {
    return {};
  },
  methods: {
    joinNertiviaServer() {
      PopoutsModule.ShowPopout({
        id: "captcha-popout",
        component: "CaptchaPopout",
        data: {
          callback: this.captchaVerified,
        },
      });
    },
    captchaVerified(token: string) {
      joinServerByCode("nertivia", { socketID: this.$socket.id, token });
      this.$emit("close");
    },
  },
});
</script>
<style scoped lang="scss">
.thanks {
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: center;
  height: 100%;
  margin-left: 10px;
  margin-right: 10px;
}
.info {
  margin-top: 15px;
  margin-bottom: 15px;
  font-size: 18px;
}
.card {
  display: flex;
  max-width: 400px;
  width: 100%;
  margin-bottom: 10px;
  background-color: var(--card-color);
  border-radius: 8px;
  padding: 5px;
  .image {
    height: 90px;
    width: 90px;
    flex-shrink: 0;
    margin-right: 10px;
    &.github {
      background: white;
      border-radius: 50%;
      border: solid 6px white;
      height: 84px;
      width: 84px;
    }
  }
  .side {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    a {
      text-decoration: none;
    }
    .details {
      margin-bottom: 10px;
      color: rgba(255, 255, 255, 0.7);
    }
  }
}
</style>
