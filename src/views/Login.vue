<template>
  <div class="login">
    <div class="center-box">
      <img class="logo" src="../assets/logo.svg" />
      <div class="title">Login To Nertivia</div>
      <!-- Form -->
      <form
        class="form"
        action="#"
        @submit.prevent="formSubmit"
        @keydown="keyDownEvent"
      >
        <customInput class="input" title="Email | username:tag" type="text" />
        <customInput class="input" title="Password" type="password" />
        <a class="link" href="/register">Create An Account</a>
        <button class="button" type="submit">Login</button>
      </form>
      <!-- Captcha -->
      <div class="captcha"></div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import CustomInput from "@/components/CustomInput.vue";

@Component({ components: { CustomInput } })
export default class MainApp extends Vue {
  keyDownEvent(event: KeyboardEvent) {
    if (event.keyCode === 13) {
      event.preventDefault();
      this.formSubmit();
    }
  }

  formSubmit() {
    console.log("aye");
  }
}
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
  max-width: 250px;
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
.form {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.input {
  max-width: 250px;
  flex-shrink: 0;
  width: 100%;
}
.button {
  align-self: center;
  padding: 10px;
  outline: none;
  border: none;
  font-size: 18px;
  background: var(--primary-color);
  color: white;
  border-radius: 4px;
  opacity: 0.8;
  cursor: pointer;
  transition: 0.2s;
  &:hover {
    opacity: 1;
  }
}
.link {
  color: #68aaff;
  margin-bottom: 20px;
}
</style>
