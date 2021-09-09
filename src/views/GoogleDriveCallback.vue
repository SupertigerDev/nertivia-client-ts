<template>
  <div class="login">
    <div class="center-box">
      <img class="logo" src="../assets/logo.svg" />
      <div class="title">Google Drive Link</div>
      <div class="loading" v-if="loading">
        <img src="@/assets/spinner.svg" />
        Linking...
      </div>
      <div v-else class="done">
        {{ message }}
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { GoogleDriveLink } from "@/services/authService";
import Vue from "vue";
import { defineComponent } from "vue";
export default defineComponent({
  name: "MainApp",
  data() {
    return {
      loading: true,
      success: false
    };
  },
  computed: {
    message(): any {
      if (this.success) {
        return "Account successfully linked. You may close this tab.";
      }
      return "Something went wrong while linking to Google Drive. Try again later.";
    }
  },
  mounted() {
    const url = new URL(location.href);
    const token = url.searchParams.get("state");
    const code = url.searchParams.get("code");
    if (!token || !code) {
      this.loading = false;
      return;
    }
    GoogleDriveLink(code, token)
      .then(() => {
        this.success = true;
        this.loading = false;
      })
      .catch(() => {
        this.loading = false;
        this.success = false;
      });
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
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: center;
  text-align: center;
  img {
    height: 60px;
    width: 60px;
    margin-bottom: 5px;
  }
}
.done {
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
}
</style>
