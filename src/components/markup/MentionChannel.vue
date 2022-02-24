<template>
  <span @click="changeChannel"><Mention :text="display" /></span>
</template>

<script lang="ts">
import Channel from "@/interfaces/Channel";
import { DrawersModule } from "@/store/modules/drawers";
import { PropType } from "vue";
import Mention from "./Mention.vue";

import { defineComponent } from "vue";
export default defineComponent({
  components: { Mention },
  props: {
    channel: {
      type: Object as PropType<Channel>,
      required: true,
    },
  },
  computed: {
    display() {
      return `#${this.channel.name}`;
    },
  },
  methods: {
    changeChannel() {
      DrawersModule.SetLeftDrawer(false);
      this.$router.push(
        `/app/servers/${this.channel.server_id}/${this.channel.channelId}`
      );
    },
  },
});
</script>
