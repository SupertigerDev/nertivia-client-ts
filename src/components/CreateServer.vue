<template>
  <div class="add-server">
    <div class="title">
      Create your own server. Start by naming your server.
    </div>
    <form action="#" class="form" @submit.prevent="createServer">
      <CustomInput title="Server Name" v-model="name" :error="error" />
      <CustomButton name="Create Server" />
    </form>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import CustomInput from "@/components/CustomInput.vue";
import CustomButton from "@/components/CustomButton.vue";
import { createServer } from "@/services/serverService";
import { PopoutsModule } from "@/store/modules/popouts";

@Component({ components: { CustomInput, CustomButton } })
export default class AddServer extends Vue {
  name = "";
  requestSent = false;
  error: string | null = null;
  createServer() {
    if (this.requestSent) return;
    this.requestSent = true;
    this.error = null;
    const trimmedName = this.name.trim();
    if (!trimmedName.length) {
      this.requestSent = false;
      return (this.error = "Server name not provided.");
    }
    createServer(trimmedName)
      .then(async (res: any) => {
        this.$router.push(
          `/app/servers/${res.server_id}/${res.default_channel_id}`
        );
        PopoutsModule.ClosePopout("add-server");
      })
      .catch(async err => {
        if (!err.response) {
          this.error = "Cannot connect to server.";
        } else {
          this.error = (await err.response.json()).message;
        }
        this.requestSent = false;
      });
  }
}
</script>

<style lang="scss" scoped>
.add-server {
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
