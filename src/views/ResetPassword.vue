<template>
  <div class="reset-password">
    <div class="center-box">
      <img class="logo" src="../assets/logo.svg" />
      <div class="title">Reset Password</div>
      <!-- Form -->
      <form
        v-if="page === 0"
        class="form"
        action="#"
        @submit.prevent="resetPasswordRequest"
        @keydown="keyDownEvent"
      >
        <div class="other-error">{{ errors["other"] }}</div>
        <customInput
          class="input"
          v-model="email"
          title="Email"
          prefixIcon="alternate_email"
          placeholder="Email"
          :error="errors['email']"
        />
        <CustomButton name="Reset" :filled="true" />
        <a class="link" href="/login">Login</a>
        <a class="link" href="/register">Signup</a>
      </form>
      <!-- Captcha -->
      <div class="captcha" v-if="page === 1">
        <div class="sub-title">Verify that you're not a bot.</div>
        <Captcha ref="captcha" @verify="resetPasswordRequest" />
      </div>
      <!-- Confirm Email -->
      <div v-if="page === 2">
        <div class="sub-title">
          Email sent!<br />Open your email to reset your password.
        </div>
      </div>
      <!-- Change Password -->
      <div v-if="page === 3">
        <div class="sub-title">Create a new password.</div>
        <div class="other-error">{{ errors["other"] }}</div>
        <customInput
          class="input"
          v-model="password"
          title="Password"
          type="password"
          prefixIcon="lock"
          :error="errors['password']"
        />
        <CustomButton
          @click="resetPassword"
          name="Change Password"
          :filled="true"
        />
      </div>
      <!-- success change -->
      <div v-if="page === 4">
        Password changed. <a href="/login">Click here to login</a>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import CustomInput from "@/components/CustomInput.vue";
import Captcha from "@/components/Captcha.vue";
import CustomButton from "@/components/CustomButton.vue";

import { resetPassword, resetPasswordRequest } from "@/services/authService";

import { defineComponent } from "vue";
export default defineComponent({
  name: "MainApp",
  components: { CustomInput, Captcha, CustomButton },
  data() {
    return {
      page: 0,
      email: "",
      password: "",
      resetPasswordPostSent: false,
      errors: {} as any,
    };
  },
  mounted() {
    if (this.$route.query["unique-id"]) {
      this.page = 3;
    }
  },
  methods: {
    keyDownEvent(event: KeyboardEvent) {
      if (event.keyCode === 13) {
        event.preventDefault();
        this.resetPasswordRequest();
      }
    },
    resetPasswordRequest(token?: string) {
      this.errors = {};
      const email = this.email;
      resetPasswordRequest(email, token)
        .then(() => {
          this.page = 2;
          return;
        })
        .catch((err) => {
          this.page = 0;
          if (!err.response) {
            this.errors["other"] = "Unable to connect to server";
            return;
          }
          return err.response.json();
        })
        .then((res) => {
          if (!res) return;
          if (res.code === "CONFIRM_EMAIL") {
            this.page = 2;
            return;
          }
          if (!res.errors) return;
          if (res.errors[0].code === 1) {
            this.page = 1;
            return;
          }
          const errors: any = {};
          for (let i = 0; i < res.errors.length; i++) {
            const error = res.errors[i];
            if (error.param === "email") {
              errors[error.param] = error.msg;
              continue;
            }
            errors["other"] = error.msg;
          }
          this.errors = errors;
        });
    },
    resetPassword() {
      if (this.resetPasswordPostSent) return;
      this.errors = {};
      this.resetPasswordPostSent = true;
      const id = this.$route.query["unique-id"];
      const code = this.$route.query["code"];
      resetPassword(code as any, id as any, this.password)
        .then(() => {
          this.page = 4;
        })
        .catch(async (err) => {
          if (!err.response) {
            this.errors["other"] = "Unable to connect to server";
            return;
          }
          const { errors } = await err.response.json();
          for (let i = 0; i < errors.length; i++) {
            const error = errors[i];
            if (error.param === "password") {
              this.errors[error.param] = error.msg;
              continue;
            }
            this.errors.other = error.msg;
          }
        })
        .finally(() => (this.resetPasswordPostSent = false));
    },
  },
});
</script>
<style lang="scss" scoped>
.reset-password {
  height: 100%;
  width: 100%;
  display: flex;
  overflow: auto;
}
.center-box {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  align-content: center;
  align-items: center;
  margin: auto;
  max-width: 300px;
  width: 100%;
}
.logo {
  height: 120px;
  width: 120px;
  flex-shrink: 0;
}
.title {
  font-size: 18px;
  flex-shrink: 0;
  margin-bottom: 20px;
}
.sub-title {
  text-align: center;
  margin-bottom: 5px;
  opacity: 0.8;
}
.form {
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: hidden;
}
.input {
  flex-shrink: 0;
}
.other-error {
  color: var(--alert-color);
  margin-bottom: 10px;
}
.button {
  margin-top: 10px;
}

.link {
  margin-top: 5px;
  font-size: 14px;
  margin-left: 5px;
  align-self: flex-start;
}
</style>
