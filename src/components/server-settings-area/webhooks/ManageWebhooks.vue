<template>
  <div class="container">
    <div class="inner-container">
      <div class="description">
        <div class="material-icons">info</div>
        {{ $t("server-settings.tab-names.manage-webhooks") }}
      </div>

      <div class="box">
        <CustomButton class="create-button" name="Create Webhook" icon="add" />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { ServersModule } from "@/store/modules/servers";

import LoadingScreen from "@/components/LoadingScreen.vue";
import CustomButton from "@/components/CustomButton.vue";

import { defineComponent } from "vue";
export default defineComponent({
  name: "ManageWebhooks",
  components: { CustomButton },
  data() {
    return {};
  },
  computed: {
    server(): any {
      return ServersModule.servers[this.serverID];
    },
    serverID(): any {
      return this.$route.params.server_id;
    },
  },
  mounted() {
    //
  },
  methods: {},
});
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  flex: 1;
}
.inner-container {
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: hidden;
}
.description {
  display: flex;
  align-items: center;
  align-content: center;
  margin-left: 10px;
  margin-top: 10px;
  .material-icons {
    margin-right: 5px;
  }
}
.create-button {
  align-self: flex-start;
  margin-left: 10px;
}

.box {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
}
</style>
