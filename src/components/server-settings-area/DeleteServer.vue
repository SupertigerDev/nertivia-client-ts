<template>
  <div class="container">
    <div class="description">
      <div class="material-icons">info</div>
      <span
        ><!-- TODO: i18n -->
        Are you sure you want to delete the server named
        <span class="name" v-if="server">{{ server.name }}</span
        >?</span
      >
    </div>
    <div class="box">
      <CustomInput
        class="input"
        :error="error"
        :title="$t('server-settings.delete-server.type-server-name-to-confirm')"
        v-model="nameInput"
      />

      <CustomButton
        :filled="true"
        :name="
          !requestSent
            ? $t('server-settings.tab-names.delete-server')
            : $t('server-settings.delete-server.deleting')
        "
        :warn="true"
        @click="deleteButton"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import CustomInput from "@/components/CustomInput.vue";
import CustomButton from "@/components/CustomButton.vue";
import { ServersModule } from "@/store/modules/servers";
import { deleteServer } from "@/services/serverService";
@Component({
  components: { CustomInput, CustomButton }
})
export default class General extends Vue {
  nameInput = "";
  requestSent = false;
  error: null | string = null;
  deleteButton() {
    if (this.requestSent) return;
    this.error = null;
    if (this.nameInput !== this.server.name) {
      this.error = "Check server name and try again.";
      return;
    }
    this.requestSent = true;
    deleteServer(this.serverID)
      .catch(async err => {
        if (!err.response) {
          this.error = "Could not connect to server.";
          return;
        }
        this.error = await err.response.json();
      })
      .finally(() => (this.requestSent = false));
  }
  get server() {
    return ServersModule.servers[this.serverID];
  }
  get serverID() {
    return this.$route.params.server_id;
  }
}
</script>

<style lang="scss" scoped>
.description {
  display: flex;
  align-items: center;
  align-content: center;
  .material-icons {
    margin-right: 5px;
  }
}
.notice {
  opacity: 0.6;
  margin-left: 30px;
}
.container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 10px;
  overflow: auto;
}

.box {
  display: flex;
  flex-direction: column;
  max-width: 300px;
  width: 100%;
  margin-top: 10px;
}
.input {
  width: 100%;
}
.title {
  font-size: 18px;
  opacity: 0.7;
}
.name {
  background: var(--alert-color);
  border-radius: 4px;
  padding: 2px;
  font-weight: bold;
}
</style>
