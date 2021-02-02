<template>
  <div class="message-box">
    <FileUpload
      v-if="showUploadBox"
      :key="showUploadBox.name + showUploadBox.size"
    />
    <EmojiPicker
      class="emoji-picker"
      v-if="showEmojiPicker"
      @close="showEmojiPicker = false"
    />
    <TypingStatus />
    <EditPanel
      v-if="editingMessageID"
      :messageID="editingMessageID"
      @close="editingMessageID = null"
    />
    <div class="input-box">
      <ButtonTemplate
        icon="attach_file"
        @click="$refs.sendFileBrowse.click()"
        v-if="!showUploadBox && !editingMessageID"
      />

      <ButtonTemplate
        icon="close"
        :warn="true"
        v-else-if="showUploadBox"
        @click="removeAttachment"
      />

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

      <ButtonTemplate
        icon="tag_faces"
        class="emoji-button"
        @click="showEmojiPicker = !showEmojiPicker"
      />
      <ButtonTemplate
        v-if="message.trim().length && editingMessageID"
        @click="sendMessage"
        icon="edit"
      />
      <ButtonTemplate
        v-else-if="!message.length && editingMessageID"
        @click="sendMessage"
        :warn="true"
        icon="delete"
      />
      <ButtonTemplate
        v-else-if="message.trim().length || showUploadBox"
        @click="sendMessage"
        :icon="showUploadBox ? 'upload' : 'send'"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { FileUploadModule } from "@/store/modules/fileUpload";
import FileUpload from "./FileUpload.vue";
import TypingStatus from "./TypingStatus.vue";
import ButtonTemplate from "./MessageBoxButtonTemplate.vue";
import EditPanel from "./EditPanel.vue";
import { MeModule } from "@/store/modules/me";
import { MessagesModule } from "@/store/modules/messages";
import { MessageInputModule } from "@/store/modules/messageInput";
import { Component, Vue, Watch } from "vue-property-decorator";
import WindowProperties from "@/utils/windowProperties";
import { editMessage, postTypingStatus } from "@/services/messagesService";
import Message from "@/interfaces/Message";
import { eventBus } from "@/utils/globalBus";
import { PopoutsModule } from "@/store/modules/popouts";
const EmojiPicker = () =>
  import(
    /* webpackChunkName: "EmojiPicker" */ "@/components/emoji-picker/EmojiPicker.vue"
  );

@Component({
  components: {
    FileUpload,
    TypingStatus,
    EditPanel,
    EmojiPicker,
    ButtonTemplate
  }
})
export default class MessageBoxArea extends Vue {
  postTypingTimeout: number | null = null;
  showEmojiPicker = false;
  mounted() {
    this.resizeTextArea();
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
  keyDownEvent(e: KeyboardEvent) {
    // shift + enter = new line
    if (e.shiftKey) return;
    // enter key send message
    if (e.key === "Enter") {
      e.preventDefault();
      this.sendMessage();
      return;
    }

    // up key to edit previous message
    if (e.key === "ArrowUp") {
      if (this.message.trim()) return;
      if (!this.channelMessages?.length) return;
      const reversedMessages = [...this.channelMessages].reverse();
      const message = reversedMessages.find(
        m =>
          m.creator.uniqueID === MeModule.user.uniqueID &&
          !m.type &&
          m.messageID
      );
      if (!message) return;
      if (!message.messageID) return;
      this.setEditMessage(undefined, message as Required<Message>);
      e.preventDefault();
      return;
    }
    if (e.key === "Escape") {
      this.editingMessageID = null;
      this.message = "";
    }
  }
  setEditMessage(messageID?: string, _message?: Required<Message>) {
    (this.$refs["textarea"] as HTMLElement).focus();
    const message =
      _message || this.channelMessages.find(m => m.messageID === messageID);
    if (!message) return;
    FileUploadModule.SetFile(undefined);
    this.editingMessageID = message.messageID || null;
    this.message = message.message || "";
  }
  sendMessage() {
    (this.$refs["textarea"] as HTMLElement).focus();
    const message = this.message;

    if (this.editingMessageID) {
      this.editMessage();
      return;
    }

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

  editMessage() {
    if (!this.editingMessageID) return;
    const message = this.message;
    const messageID = this.editingMessageID;
    const channelID = this.channelID;
    if (!this.message.length) {
      PopoutsModule.ShowPopout({
        component: "delete-message-popout",
        data: { messageID: this.editingMessageID, channelID: this.channelID },
        id: "delete-message"
      });
      return;
    }
    this.message = "";
    this.editingMessageID = null;

    const findMessage = this.channelMessages.find(
      e => e.messageID === messageID
    );
    if (message.trim() === findMessage?.message) return;

    MessagesModule.UpdateMessage({
      channelID,
      messageID,
      message: {
        message,
        sending: 0
      }
    });

    editMessage(messageID, channelID, { message })
      .then(() => {
        MessagesModule.UpdateMessage({
          channelID,
          messageID,
          message: {
            sending: 1,
            timeEdited: Date.now()
          }
        });
      })
      .catch(() => {
        MessagesModule.UpdateMessage({
          channelID,
          messageID,
          message: {
            sending: 2,
            timeEdited: undefined
          }
        });
      });
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
    this.editingMessageID = null;
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
  @Watch("windowWidthSize")
  onWidthResize() {
    this.resizeTextArea();
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
  get windowWidthSize() {
    return WindowProperties.resizeWidth;
  }
  get showUploadBox() {
    return FileUploadModule.file.file;
  }
  get channelID() {
    return this.$route.params.channel_id;
  }
  get channelMessages() {
    return MessagesModule.channelMessages(this.channelID);
  }
  get message() {
    return MessageInputModule.message;
  }
  set message(val) {
    MessageInputModule.setMessage(val);
  }

  get editingMessageID() {
    return MessageInputModule.editingMessageID;
  }
  set editingMessageID(val) {
    MessageInputModule.SetEditingMessage(val);
  }
}
</script>

<style lang="scss" scoped>
.message-box {
  display: flex;
  flex-direction: column;
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
.emoji-picker {
  position: absolute;
  bottom: 55px;
  right: 10px;
  z-index: 111111111111111;
}
</style>
