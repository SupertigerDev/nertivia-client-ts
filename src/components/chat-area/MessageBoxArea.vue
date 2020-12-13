<template>
  <div class="message-box">
    <FileUpload
      v-if="showUploadBox"
      :key="showUploadBox.name + showUploadBox.size"
    />
    <TypingStatus />
    <div class="input-box">
      <div
        class="material-icons button attach-button"
        @click="$refs.sendFileBrowse.click()"
        v-if="!showUploadBox"
      >
        attach_file
      </div>
      <div
        class="material-icons button close-button"
        @click="removeAttachment"
        v-else
      >
        close
      </div>
      <input
        type="file"
        ref="sendFileBrowse"
        style="display: none"
        @change="attachmentChange"
      />
      <textarea
        v-bind:value="isConnected ? message : ''"
        @input="message = $event.target.value"
        @keydown="keyDownEvent"
        @paste="onPaste"
        ref="textarea"
        class="textarea"
        :disabled="!isConnected"
        :placeholder="placeholderMessage"
      />
      <div
        class="material-icons button send-button"
        v-if="message.trim().length || showUploadBox"
        @click="sendMessage"
      >
        {{ showUploadBox ? "upload" : "send" }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { FileUploadModule } from "@/store/modules/fileUpload";
import FileUpload from "./FileUpload.vue";
import TypingStatus from "./TypingStatus.vue";
import { MeModule } from "@/store/modules/me";
import { MessagesModule } from "@/store/modules/messages";
import { MessageInputModule } from "@/store/modules/messageInput";
import { Component, Vue, Watch } from "vue-property-decorator";
import WindowProperties from "@/utils/windowProperties";
import { postTypingStatus } from "@/services/messagesService";

@Component({ components: { FileUpload, TypingStatus } })
export default class MessageBoxArea extends Vue {
  postTypingTimeout: number | null = null;
  mounted() {
    this.resizeTextArea();
  }
  beforeDestroy() {
    this.stopPostingTypingStatus();
  }
  // ctrl + v event (for screenshots)
  onPaste(event: any) {
    const items = (event.clipboardData || event.originalEvent.clipboardData)
      .items;
    for (const index in items) {
      const item = items[index];
      if (item.kind === "file") {
        const blob = item.getAsFile();
        FileUploadModule.SetFile(blob);
      }
    }
  }

  attachmentChange(event: any) {
    const file: File = event.target.files[0];
    event.target.value = "";
    FileUploadModule.SetFile(file);
    (this.$refs["textarea"] as HTMLElement).focus();
  }
  removeAttachment() {
    FileUploadModule.SetFile(undefined);
  }
  @Watch("message")
  messageChanged() {
    this.resizeTextArea();
  }
  @Watch("channelID")
  onChannelIDChange() {
    (this.$refs["textarea"] as HTMLElement).focus();
    this.stopPostingTypingStatus();
  }
  @Watch("message")
  async postTypingStatus() {
    if (!this.message.trim().length && this.postTypingTimeout) {
      clearTimeout(this.postTypingTimeout);
      this.postTypingTimeout = null;
      return;
    }
    if (this.postTypingTimeout) return;
    postTypingStatus(this.channelID);
    this.postTypingTimeout = setTimeout(() => {
      this.postTypingTimeout = null;
      if (!this.message.trim().length) return;
      this.postTypingStatus();
    }, 2000);
  }
  @Watch("isFocused")
  onFocusChange() {
    if (!this.isFocused) {
      this.stopPostingTypingStatus();
    }
  }
  keyDownEvent(e: KeyboardEvent) {
    if (e.shiftKey) return;
    if (e.code === "Enter") {
      e.preventDefault();
      this.sendMessage();
      return;
    }
  }
  sendMessage() {
    (this.$refs["textarea"] as HTMLElement).focus();
    const message = this.message;

    if (this.showUploadBox) {
      this.message = "";
      FileUploadModule.AddToQueue({
        channelID: this.$route.params.channel_id,
        message
      });
      return;
    } else {
      if (!this.message.trim().length) return;
      this.message = "";
      MessagesModule.SendMessage({
        message,
        channelID: this.$route.params.channel_id
      });
    }
  }
  resizeTextArea() {
    this.$nextTick(() => {
      const textarea = this.$refs.textarea as HTMLElement;
      textarea.style.height = "";
      if (textarea.scrollHeight >= 230) {
        textarea.style.height = "230px";
        return;
      }
      textarea.style.height = textarea.scrollHeight + "px";
    });
  }
  stopPostingTypingStatus() {
    this.postTypingTimeout && clearTimeout(this.postTypingTimeout);
    this.postTypingTimeout = null;
  }
  get placeholderMessage() {
    if (!this.isConnected) {
      return "Not Connected";
    }
    if (this.showUploadBox) {
      return "Attach a message";
    }
    return "Type your message";
  }
  get isConnected() {
    return MeModule.connected;
  }
  get isFocused() {
    return WindowProperties.isFocused;
  }
  get showUploadBox() {
    return FileUploadModule.file.file;
  }
  get channelID() {
    return this.$route.params.channel_id;
  }
  get message() {
    return MessageInputModule.message;
  }
  set message(val) {
    MessageInputModule.setMessage(val);
  }
}
</script>

<style lang="scss" scoped>
.message-box {
  display: flex;
  // flex-direction: column;
  background: rgba(255, 255, 255, 0.07);

  flex-shrink: 0;
  min-height: 45px;
  position: relative;
}

.input-box {
  display: flex;
  flex: 1;
  place-items: center;
}
.textarea {
  outline: none;
  border: none;
  resize: none;
  font-size: 14px;
  margin: 5px;
  margin-top: 12px;
  height: 20px;
  flex-shrink: 0;
  flex: 1;
  background: transparent;
  color: white;
}
.button {
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: flex-end;
  margin-bottom: 5px;
  font-size: 25px;
  margin-right: 5px;
  cursor: pointer;
  height: 35px;
  opacity: 0.7;
  width: 45px;
  border-radius: 5px;
  transition: 0.2s;
  user-select: none;
  &:hover {
    background: var(--primary-color);
    opacity: 1;
  }
  &.attach-button {
    margin-left: 5px;
  }
  &.close-button {
    margin-left: 5px;
    &:hover {
      background: var(--alert-color);
      opacity: 1;
    }
  }
}
</style>
