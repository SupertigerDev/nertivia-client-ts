<template>
  <div class="container">
    <div class="inner-container">
      <InformationTemplate
        class="information"
        :title="$t('server-settings.tab-names.manage-webhooks')"
      />

      <div class="box">
        <CustomButton
          class="create-button"
          @click="create"
          name="Create Webhook"
          icon="add"
        />
        <div class="list">
          <WebhookTemplate
            v-for="webhook in webhooks"
            :key="webhook.id"
            :webhook="webhook"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { ServersModule } from "@/store/modules/servers";
import InformationTemplate from "@/components/InformationTemplate.vue";

import LoadingScreen from "@/components/LoadingScreen.vue";
import CustomButton from "@/components/CustomButton.vue";
import { createWebhook } from "@/services/webhookService";

import WebhookTemplate from "./WebhookTemplate.vue";
import { defineComponent } from "vue";
import Webhook from "@/interfaces/Webhook";
export default defineComponent({
  name: "ManageWebhooks",
  components: { InformationTemplate, CustomButton, WebhookTemplate },
  data() {
    return {
      webhooks: [] as Webhook[],
    };
  },
  computed: {
    server(): any {
      return ServersModule.servers[this.serverId];
    },
    serverId(): any {
      return this.$route.params.server_id;
    },
  },
  mounted() {
    //
  },
  methods: {
    create() {
      createWebhook(this.serverId).then((res) => {
        this.webhooks.unshift(res);
      });
    },
  },
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
.information {
  margin-left: 10px;
  margin-top: 10px;
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
