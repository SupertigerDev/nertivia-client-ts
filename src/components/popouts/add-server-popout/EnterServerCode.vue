<template>
  <div class="enter-server-code">
    <div class="title">{{ $t("add-server-popout.join-server-notice") }}</div>
    <form action="#" class="form" @submit.prevent="joinServer">
      <CustomInput title="Invite Code" v-model="code" :error="error" />
      <CustomButton name="Join Server" />
    </form>
  </div>
</template>
<script lang="ts">
import CustomInput from "@/components/CustomInput.vue";
import CustomButton from "@/components/CustomButton.vue";
import { getServerInfoByCode } from "@/services/serverService";

import { defineComponent } from "vue";
export default defineComponent({
  name: "EnterServerCode",
  components: { CustomInput, CustomButton },
  data() {
    return {
      code: "",
      requestSent: false,
      error: null as string | null,
    };
  },
  methods: {
    joinServer() {
      if (this.requestSent) return;
      this.requestSent = true;
      this.error = null;
      let trimmedCode = this.code.trim();
      // check if invite code is a link
      trimmedCode = trimmedCode.split("/")[trimmedCode.split("/").length - 1];
      if (!trimmedCode.length) {
        this.requestSent = false;
        return (this.error = "Cannot join emptiness.");
      }

      getServerInfoByCode(trimmedCode)
        .then((json) => {
          this.$emit("success", { json, code: trimmedCode });
        })
        .catch(async (err) => {
          if (!err.response) {
            this.error = "Cannot connect to server.";
          } else {
            this.error = (await err.response.json()).message;
          }
          this.requestSent = false;
        });
    },
  },
});
</script>

<style lang="scss" scoped>
.enter-server-code {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  margin: 10px;
  display: flex;
  flex-direction: column;
}
.title {
  opacity: 0.8;
}
.form {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 200px;
  margin-top: 80px;
  align-self: center;
}
</style>
