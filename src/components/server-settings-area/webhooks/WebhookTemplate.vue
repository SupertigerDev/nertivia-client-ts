<template>
  <div class="webhook">
    <CustomInput title="Name" v-model="name" />
    <CustomDropDown
      title="Channel"
      IdPath="channelID"
      :items="serverChannels"
      :defaultId="channel.channelID"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from "@vue/runtime-core";
import Webhook from "@/interfaces/Webhook";
import { ChannelsModule } from "@/store/modules/channels";
import router from "@/router";
import CustomInput from "@/components/CustomInput.vue";
import CustomDropDown from "@/components/CustomDropDown.vue";
export default defineComponent({
  components: { CustomInput, CustomDropDown },
  props: {
    webhook: { type: Object as PropType<Webhook>, required: true },
  },
  setup(props) {
    const name = ref(props.webhook.name);
    const serverId = router.currentRoute.value.params.server_id as string;
    const serverChannels = ChannelsModule.serverChannels(serverId);
    const channel = ChannelsModule.channels[props.webhook.channel.channelID];

    return { serverChannels, channel, name };
  },
});
</script>

<style lang="scss" scoped>
.webhook {
  border-radius: 4px;
  background-color: var(--card-color);
  margin: 10px;
  padding: 10px;
}
</style>
