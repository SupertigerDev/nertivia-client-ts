<template>
  <div class="edit-panel">
    <div class="animate-container">
      <div class="material-icons icon">edit</div>
      <div class="material-icons icon" v-if="isImage">insert_photo</div>
      <div class="material-icons icon" v-else-if="isFile">
        insert_drive_file
      </div>
      <div class="title">Editing:</div>
      <div class="message" v-if="message">{{ message.message }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { MessagesModule } from "@/store/modules/messages";

import { defineComponent } from "vue";
export default defineComponent({
  name: "EditPanel",
  props: {
    messageID: {
      type: String,
      required: true,
    },
  },
  computed: {
    isImage(): any {
      return this.message?.files?.[0]?.dimensions;
    },
    isFile(): any {
      return this.message?.files?.[0];
    },
    message(): any {
      return MessagesModule.channelMessages(
        this.$route.params.channel_id as string
      ).find((m) => m.messageID === this.messageID);
    },
  },
  watch: {
    message: {
      handler: "onMessageChange",
    },
  },
  methods: {
    onMessageChange() {
      if (!this.message) {
        this.$emit("close");
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.edit-panel {
  display: flex;
  align-items: center;
  height: 30px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.1);
}

.title {
  margin-left: 5px;
  opacity: 0.7;
}
.icon {
  margin-left: 5px;
  opacity: 0.7;
}
.message {
  margin-left: 5px;
  white-space: nowrap;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-right: 10px;
}
.animate-container {
  display: flex;
  align-items: center;
  opacity: 0;
  animation: showUp 0.2s;
  overflow: hidden;
  animation-fill-mode: forwards;
}
@keyframes showUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
