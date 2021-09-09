<template>
  <div class="login">
    <div class="center-box">
      <img class="logo" src="../assets/logo.svg" />
      <div class="title">Login To Nertivia</div>
      <!-- Form -->
      <form
        v-if="page === 0"
        class="form"
        action="#"
        @submit.prevent="formSubmit"
        @keydown="keyDownEvent"
      >
        <div class="other-error">{{ errors["other"] }}</div>
        <customInput
          class="input"
          v-model="email"
          title="Username"
          prefixIcon="account_box"
          placeholder="Email or username:tag"
          :error="errors['email']"
        />
        <customInput
          class="input"
          v-model="password"
          title="Password"
          prefixIcon="lock"
          type="password"
          :error="errors['password']"
        />
        <CustomButton name="Login" :filled="true" />
        <a class="link" href="/reset-password">Forgot Password</a>
        <a class="link" href="/register">Signup</a>
      </form>
      <!-- Captcha -->
      <div class="captcha" v-if="page === 1">
        <div class="sub-title">Verify that you're not a bot.</div>
        <Captcha ref="captcha" @verify="captchaSubmit" />
      </div>
      <!-- Confirm Email -->
      <div v-if="page === 2">
        <div class="sub-title">
          Confirm your email before continuing by entering the code that was
          sent to you.
        </div>
        <div class="other-error">{{ errors["other"] }}</div>
        <customInput
          class="input"
          v-model="confirmEmail"
          title="Confirm Code"
          type="email"
          :error="errors['email_confirm']"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import CustomInput from "@/components/CustomInput.vue";
import Captcha from "@/components/Captcha.vue";
import CustomButton from "@/components/CustomButton.vue";

import { postLogin, confirmEmail } from "@/services/authService";
import Vue from "vue";
import { defineComponent } from "vue";
export default defineComponent({
  name: "MainApp",
  components: { CustomInput, Captcha, CustomButton },
  data() {
    return {
      page: 0,
      email: "",
      password: "",
      confirmEmail: "",
      errors: {} as any
    };
  },
  watch: {
    confirmEmail: {
      handler: "onEmailConfirmInput"
    }
  },
  methods: {
    onEmailConfirmInput() {
      const value = this.confirmEmail.trim();
      if (value.length !== 10) return;
      confirmEmail(this.email, value)
        .then(data => {
          localStorage.clear();
          localStorage["hauthid"] = data.token;
          this.redirect();
        })
        .catch(err => {
          if (!err.response) return;
          return err.response.json();
        })
        .then(res => {
          if (!res)
            return (this.errors["other"] = "Unable to connect to server");
          if (!res.error) return;
          return (this.errors["email_confirm"] = res.error);
        });
    },
    keyDownEvent(event: KeyboardEvent) {
      if (event.keyCode === 13) {
        event.preventDefault();
        this.formSubmit();
      }
    },
    captchaSubmit(token: string) {
      this.login(token);
    },
    login(token?: string) {
      const email = this.email;
      const password = this.password;
      postLogin(email, password, token)
        .then(data => {
          if (data.action === "logged_in") {
            localStorage.clear();
            localStorage["hauthid"] = data.token;
            this.redirect();
            return;
          }
        })
        .catch(err => {
          this.page = 0;
          if (!err.response) {
            this.errors["other"] = "Unable to connect to server";
            return;
          }
          return err.response.json();
        })
        .then(res => {
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
            if (error.param === "email" || error.param === "password") {
              errors[error.param] = error.msg;
              continue;
            }
            errors["other"] = error.msg;
          }
          this.errors = errors;
        });
    },
    formSubmit() {
      this.errors = {};
      this.login();
    },
    redirect() {
      if (!process.env.VUE_APP_MAIN_APP_URL) return;
      const url: string | undefined = this.$route.query.redirect as any;
      if (!url || !url.startsWith(process.env.VUE_APP_MAIN_APP_URL)) {
        location.href = "/app";
        return;
      }
      location.href = url;
    }
  }
});
</script>
<style lang="scss" scoped>
.login {
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
  margin-bottom: 40px;
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
