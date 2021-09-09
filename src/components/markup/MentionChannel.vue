<template>
  <span @click="changeChannel"><Mention :text="display"/></span>
</template>

<script lang="ts">
import Channel from "@/interfaces/Channel";
import { DrawersModule } from "@/store/modules/drawers";
import Vue from "vue";
import Mention from "./Mention.vue";

export interface MentionChannelProps {
  channel: Channel;
}

import { defineComponent } from "vue";
export default defineComponent<unknown, unknown, unknown, MentionChannelProps>({
  components: { Mention },
  props: {
    channel: Object
  },
  computed: {
    display() {
      return `#${this.channel.name}`;
    }
  },
  methods: {
    changeChannel() {
      DrawersModule.SetLeftDrawer(false);
      this.$router.push(
        `/app/servers/${this.channel.server_id}/${this.channel.channelID}`
      );
    }
  }
});
</script>
