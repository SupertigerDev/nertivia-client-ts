<template>
  <div class="register">
    <div class="center-box">
      <img class="logo" src="../assets/logo.svg" />
      <div class="text">Nertivia has been discontinued.</div>
      <div class="text">
        Please try out <a href="https://nerimity.com">https://nerimity.com</a> instead.
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import CustomInput from "@/components/CustomInput.vue";
import Captcha from "@/components/Captcha.vue";
import CustomButton from "@/components/CustomButton.vue";
import AgreementMessage from "@/components/AgreementMessage.vue";

import { confirmEmail, postRegister } from "@/services/authService";

import { defineComponent } from "vue";
export default defineComponent({
  name: "MainApp",
  components: { CustomInput, Captcha, CustomButton, AgreementMessage },
  data() {
    return {
      page: 0,
      username: "",
      email: "",
      password: "",
      confirmEmail: "",
      errors: {} as any,
      requestSent: false,
    };
  },
  watch: {
    confirmEmail: {
      handler: "onEmailConfirmInput",
    },
  },
  methods: {
    onEmailConfirmInput() {
      const value = this.confirmEmail.trim();
      if (value.length !== 10) return;
      confirmEmail(this.email, value)
        .then((data) => {
          localStorage.clear();
          localStorage["hauthid"] = data.token;
          location.href = "/app";
        })
        .catch((err) => {
          if (!err.response) return;
          return err.response.json();
        })
        .then((res) => {
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
      this.register(token);
    },
    register(token?: string) {
      if (this.requestSent) return;
      this.requestSent = true;
      const email = this.email;
      const username = this.username;
      const password = this.password;
      postRegister(username, email, password, token)
        .then((data) => {
          localStorage.clear();
          localStorage["hauthid"] = data.token;
          location.href = "/app";
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
          if (!res.errors) return;
          if (res.errors[0].code === 1) {
            this.page = 1;
            return;
          }
          const errors: any = {};
          for (let i = 0; i < res.errors.length; i++) {
            const error = res.errors[i];
            if (
              error.param === "email" ||
              error.param === "password" ||
              error.param === "username"
            ) {
              errors[error.param] = error.msg;
              continue;
            }
            errors["other"] = error.msg;
          }
          this.errors = errors;
        })
        .finally(() => (this.requestSent = false));
    },
    formSubmit() {
      this.errors = {};
      this.register();
    },
  },
});
</script>
<style lang="scss" scoped>
.register {
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
  text-align: center;
}
.logo {
  height: 120px;
  width: 120px;
  flex-shrink: 0;
}
.text {
  margin-bottom: 10px;
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
  margin-top: 10px;
  font-size: 14px;
  margin-left: 5px;
  align-self: flex-start;
}
.description {
  align-self: flex-start;
  display: flex;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  align-items: center;
  margin-top: 5px;
  margin-bottom: 5px;
  .material-icons {
    margin-right: 10px;
    margin-left: 10px;
    &.alert {
      color: var(--alert-color);
    }
    &.warn {
      color: var(--warn-color);
    }
  }
}
.card {
  border: solid 1px rgba(255, 255, 255, 0.1);
  background: var(--card-color);
  padding: 5px;
  margin-bottom: 10px;
  border-radius: 4px;
}
.agree-message {
  margin-left: 5px;
  margin-right: 5px;
}
</style>
