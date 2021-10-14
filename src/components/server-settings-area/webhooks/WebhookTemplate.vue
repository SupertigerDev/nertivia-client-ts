<template>
  <div class="webhook">
    <div class="inputs">
      <CustomInput
        class="input"
        title="Name"
        v-model="name"
        :connectRight="true"
      />
      <CustomDropDown
        class="input"
        title="Channel"
        IdPath="channelID"
        :connectLeft="true"
        :items="serverChannels"
        :defaultId="channelId"
        @change="onDropDownChange"
      />
    </div>
    <div class="buttons">
      <CustomButton
        name="Update"
        v-if="Object.keys(changes).length"
        @click="onUpdateClicked"
        icon="save"
        :disabled="requestSent"
      />
      <CustomButton name="Copy URL" icon="link" @click="onCopyLinkClicked" />
      <CustomButton
        name="Delete"
        icon="delete"
        :alert="true"
        @click="onDeleteClicked"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, computed } from "@vue/runtime-core";
import Webhook from "@/interfaces/Webhook";
import { ChannelsModule } from "@/store/modules/channels";
import router from "@/router";
import CustomInput from "@/components/CustomInput.vue";
import CustomDropDown from "@/components/CustomDropDown.vue";
import CustomButton from "@/components/CustomButton.vue";
import { toClipboard } from "@soerenmartius/vue3-clipboard";
import {
  deleteWebhook,
  getWebookToken,
  updateWebhook,
} from "@/services/webhookService";
export default defineComponent({
  components: { CustomInput, CustomDropDown, CustomButton },
  props: {
    webhook: { type: Object as PropType<Webhook>, required: true },
  },
  setup(props, context) {
    const requestSent = ref(false);
    const name = ref(props.webhook.name);
    const channelId = ref(props.webhook.channel.channelID);
    const serverId = router.currentRoute.value.params.server_id as string;
    const serverChannels = ChannelsModule.serverChannels(serverId);

    const changes = computed(() => {
      const changes: any = {};
      if (name.value !== props.webhook.name) changes.name = name.value;
      if (channelId.value !== props.webhook.channel.channelID)
        changes.channelId = channelId.value;
      return changes;
    });

    const onDropDownChange = (changedChannelId: string) => {
      channelId.value = changedChannelId;
    };
    const onDeleteClicked = () => {
      deleteWebhook(serverId, props.webhook.id).then(() => {
        context.emit("delete");
      });
    };
    const onUpdateClicked = () => {
      if (requestSent.value) return;
      requestSent.value = true;
      updateWebhook(serverId, props.webhook.id, changes.value)
        .then(() => {
          context.emit("update", {
            ...changes.value,
            id: props.webhook.id,
            channel: { channelID: channelId.value },
          });
        })
        .finally(() => (requestSent.value = false));
    };

    let tokenCache: string | null = null;
    const getToken = async () => {
      if (tokenCache) return tokenCache;
      tokenCache = await getWebookToken(serverId, props.webhook.id);
      return tokenCache;
    };
    const onCopyLinkClicked = async () => {
      const token = await getToken();
      toClipboard(
        process.env.VUE_APP_FETCH_PREFIX +
          `/webhooks/${props.webhook.id}/${token}`
      );
    };
    return {
      serverChannels,
      channelId,
      name,
      changes,
      requestSent,
      onDropDownChange,
      onDeleteClicked,
      onUpdateClicked,
      onCopyLinkClicked,
    };
  },
});
</script>

<style lang="scss" scoped>
.webhook {
  border-radius: 8px;
  background-color: var(--card-color);
  margin: 10px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  align-items: flex-start;
}
.inputs {
  display: flex;
  margin-bottom: -15px;
}
.input {
  width: 200px;
  flex-shrink: 0;
}
.buttons {
  display: flex;
}
</style>
