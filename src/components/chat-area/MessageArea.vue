<template>
  <div class="message-area">
    <div class="loading" v-if="!channelMessages">Loading...</div>
    <MessageLogs :key="channelID" v-else />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { MessagesModule } from "@/store/modules/messages";
import MessageLogs from "./MessageLogs.vue";

@Component({ components: { MessageLogs } })
export default class MessageArea extends Vue {
  mounted() {
    this.loadChannelMessages();
  }
  @Watch("channelID")
  loadChannelMessages() {
    if (this.channelMessages) return;
    if (!this.channelID) return;
    MessagesModule.FetchAndSetMessages(this.channelID);
  }

  get channelMessages() {
    return MessagesModule.channelMessages(this.channelID);
  }
  get channelID() {
    return this.$route.params.channel_id;
  }
}
</script>

<style lang="scss" scoped>
.message-area {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}
</style>
