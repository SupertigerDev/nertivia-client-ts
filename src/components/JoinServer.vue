<template>
  <div class="join-server">
    <div class="title">Join a server by entering in an invite code.</div>
    <form action="#" class="form" @submit.prevent="joinServer">
      <CustomInput title="Invite Code" v-model="code" :error="error" />
      <CustomButton name="Join Server" />
    </form>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import CustomInput from "@/components/CustomInput.vue";
import CustomButton from "@/components/CustomButton.vue";

@Component({ components: { CustomInput, CustomButton } })
export default class JoinServer extends Vue {
  code = "";
  requestSent = false;
  error: string | null = null;
  joinServer() {
    if (this.requestSent) return;
    this.requestSent = true;
    this.error = null;
    const trimmedCode = this.code.trim();
    if (!trimmedCode.length) {
      this.requestSent = false;
      return (this.error = "Cannot join emptiness.");
    }

    console.log("clicked");
  }
}
</script>

<style lang="scss" scoped>
.join-server {
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
