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
            @delete="onDelete(webhook.id)"
            @update="onUpdate"
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
import { createWebhook, getWebooks } from "@/services/webhookService";

import WebhookTemplate from "./WebhookTemplate.vue";
import { defineComponent } from "vue";
import Webhook from "@/interfaces/Webhook";
import { ChannelsModule } from "@/store/modules/channels";
import { MeModule } from "@/store/modules/me";
import Server from "@/interfaces/Server";
export default defineComponent({
  name: "ManageWebhooks",
  components: { InformationTemplate, CustomButton, WebhookTemplate },
  data() {
    return {
      webhooks: [] as Webhook[],
    };
  },
  computed: {
    server(): Server {
      return ServersModule.servers[this.serverId];
    },
    serverId(): any {
      return this.$route.params.server_id;
    },
  },
  async mounted() {
    this.webhooks = await getWebooks(this.serverId);
  },
  methods: {
    onDelete(id: string) {
      this.webhooks = this.webhooks.filter((webhook) => webhook.id !== id);
    },
    onUpdate(updatedWebhook: Partial<Webhook>) {
      let webhook = this.webhooks.find(
        (webhook) => webhook.id === updatedWebhook.id
      );
      Object.assign(webhook, updatedWebhook);
    },
    create() {
      createWebhook(this.serverId).then((res) => {
        const webhook = {
          id: res.id,
          name: res.name,
          channel: ChannelsModule.channels[this.server.default_channel_id],
          creator: MeModule.user,
        };
        this.webhooks.unshift(webhook as any);
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
.list {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  overflow: auto;
}
</style>
