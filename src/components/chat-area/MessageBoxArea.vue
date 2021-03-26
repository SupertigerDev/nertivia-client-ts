<template>
  <div class="message-box">
    <div class="floating-items" v-if="hasSendMessagePerm">
      <SuggestionPopouts ref="suggestionPopouts" />
      <FileUpload
        v-if="showUploadBox"
        :key="showUploadBox.name + showUploadBox.size"
      />
      <RateLimitPopup v-if="rateLimit" />
      <EmojiPicker
        v-if="showEmojiPicker"
        :inputElement="$refs.textarea"
        @close="showEmojiPicker = false"
      />
      <ScrollDownButton v-if="!isScrolledDown" />
    </div>
    <TypingStatus />
    <EditPanel
      v-if="editingMessageID && hasSendMessagePerm"
      :messageID="editingMessageID"
      @close="editingMessage = null"
    />
    <div class="input-box" v-if="hasSendMessagePerm">
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
        @keyup.passive="onKeyUpEvent"
        ref="textarea"
        id="message-box"
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
    <div class="no-perm" v-else>
      You don't have permission to talk in this channel.
    </div>
  </div>
</template>

<script lang="ts">
import { FileUploadModule } from "@/store/modules/fileUpload";
import FileUpload from "./FileUpload.vue";
import SuggestionPopouts from "./suggestion-popouts/SuggestionPopouts.vue";
import TypingStatus from "./TypingStatus.vue";
import ScrollDownButton from "./ScrollDownButton.vue";
import RateLimitPopup from "./RateLimitPopup.vue";
import ButtonTemplate from "./MessageBoxButtonTemplate.vue";
import EditPanel from "./EditPanel.vue";
import { MeModule } from "@/store/modules/me";
import { MessagesModule } from "@/store/modules/messages";
import { MessageInputModule } from "@/store/modules/messageInput";
import { Component, Vue, Watch } from "vue-property-decorator";
import WindowProperties from "@/utils/windowProperties";
import { editMessage, postTypingStatus } from "@/services/messagesService";
import Message from "@/interfaces/Message";
import { PopoutsModule } from "@/store/modules/popouts";
import { formatMessage } from "@/utils/formatMessage";
import { ChannelsModule } from "@/store/modules/channels";
import { ServerMembersModule } from "@/store/modules/serverMembers";
import { permissions } from "@/constants/rolePermissions";
import { ServersModule } from "@/store/modules/servers";
import { MessageLogStatesModule } from "@/store/modules/messageLogStates";
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
    ButtonTemplate,
    SuggestionPopouts,
    ScrollDownButton,
    RateLimitPopup
  }
})
export default class MessageBoxArea extends Vue {
  postTypingTimeout: NodeJS.Timeout | null = null;
  showEmojiPicker = false;
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
  onKeyUpEvent(event: KeyboardEvent) {
    (this.$refs.suggestionPopouts as any).onkeyUp(event);
  }
  keyDownEvent(e: KeyboardEvent) {
    // if suggestions popout is showing
    if ((this.$refs.suggestionPopouts as any).isPopoutShowing) {
      const up = e.key === "ArrowUp";
      const down = e.key === "ArrowDown";
      const enter = e.key === "Enter";
      const tab = e.key === "Tab";
      if (up) {
        e.preventDefault();
        (this.$refs.suggestionPopouts as any).onArrowUp();
      }
      if (down) {
        e.preventDefault();
        (this.$refs.suggestionPopouts as any).onArrowDown();
      }
      if (enter || tab) {
        e.preventDefault();
        (this.$refs.suggestionPopouts as any).onEnter();
        return;
      }
    }

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
      this.editingMessage = null;
      this.message = "";
    }
  }
  setEditMessage(messageID?: string, _message?: Required<Message>) {
    (this.$refs["textarea"] as HTMLElement).focus();
    const message =
      _message || this.channelMessages.find(m => m.messageID === messageID);
    if (!message) return;
    FileUploadModule.SetFile(undefined);
    this.editingMessage = message;
  }
  sendMessage() {
    if (!this.channelMessages) return;
    (this.$refs["textarea"] as HTMLElement).focus();
    // format message before sending it.
    // replaces custom emoji names with emoji code n stuff
    const message = formatMessage(
      this.message,
      ChannelsModule.serverChannels(this.serverID || "")
    );

    if (this.editingMessageID) {
      this.editMessage(message);
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

  editMessage(message: string) {
    if (!this.editingMessageID) return;
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
    this.editingMessage = null;

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
      if (!textarea) return;
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
    setTimeout(() => {
      if (this.$isMobile) return;
      (this.$refs["textarea"] as HTMLElement)?.focus();
    }, 10);
    this.stopPostingTypingStatus();
    this.editingMessage = null;
  }
  @Watch("message")
  async postTypingStatus() {
    if (!this.message.trim().length) {
      this.postTypingTimeout && clearTimeout(this.postTypingTimeout);
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
  get hasSendMessagePerm() {
    if (this.currentTab !== "servers") return true;
    if (!MeModule.user.uniqueID) return false;
    if (!this.serverID) return false;

    const isServerOwner = ServersModule.isServerOwner(
      this.serverID,
      MeModule.user.uniqueID
    );
    if (isServerOwner) return true;

    const isAdmin = ServerMembersModule.isAdmin(
      MeModule.user.uniqueID,
      this.serverID
    );
    if (isAdmin) return true;
    const hasRolePerm = ServerMembersModule.memberHasPermission(
      MeModule.user.uniqueID,
      this.serverID,
      permissions.SEND_MESSAGES.value,
      false
    );
    let hasChannelPerm = this.serverChannel?.permissions?.send_message;
    if (hasChannelPerm === undefined) hasChannelPerm = true;
    if (!hasChannelPerm) return false;
    return hasRolePerm;
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
  get serverChannel() {
    return ChannelsModule.channels[this.channelID];
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
  get serverID() {
    if (this.currentTab !== "servers") return undefined;
    return this.$route.params.server_id;
  }
  get currentTab() {
    return this.$route.path.split("/")[2] || "";
  }
  get editingMessageID() {
    return this.editingMessage?.messageID;
  }
  get editingMessage() {
    return MessageInputModule.editingMessage;
  }
  set editingMessage(val) {
    MessageInputModule.SetEditingMessage(val);
  }
  get isScrolledDown() {
    return MessageLogStatesModule.isScrolledDown(this.channelID);
  }
  get rateLimit() {
    return this.serverChannel.rateLimit;
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
  caret-color: var(--primary-color);
}

.input-box {
  display: flex;
  flex: 1;
  gap: 5px;
  margin-left: 5px;
  margin-right: 5px;
  place-items: center;
  min-height: 45px;
  flex-shrink: 0;
}
.textarea {
  outline: none;
  border: none;
  resize: none;
  margin-top: 5px;
  min-width: 100px;
  font-size: 14px;
  height: 20px;
  flex-shrink: 0;
  flex: 1;
  background: transparent;
  color: white;
}
.floating-items {
  position: relative;
}
.no-perm {
  height: 100%;
  display: flex;
  align-items: center;
  opacity: 0.7;
  justify-content: center;
}
</style>
