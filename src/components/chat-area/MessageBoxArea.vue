<template>
  <div class="message-box">
    <div class="floating-items" v-if="hasSendMessagePerm">
      <SuggestionPopouts ref="suggestionPopouts" />
      <FileUpload v-if="uploadFile" :key="uploadFile.name + uploadFile.size" />
      <RateLimitPopup v-if="rateLimit" />
      <PickerArea
        v-if="showEmojiPicker"
        :inputElement="$refs.textarea"
        defaultTab="EMOJI"
        buttonClassName=".emoji-button"
        @close="showEmojiPicker = false"
      />
      <PickerArea
        v-if="showGifPicker"
        :inputElement="$refs.textarea"
        defaultTab="GIF"
        buttonClassName=".gif-button"
        @close="showGifPicker = false"
      />
      <DoodlePopout v-if="showDoodlePopout" @close="showDoodlePopout = false" />
      <ScrollDownButton v-if="!isScrolledDown" />
    </div>
    <TypingStatus />
    <SelectedMessagesActions />
    <EditPanel
      v-if="editingMessageID && hasSendMessagePerm"
      :messageID="editingMessageID"
      @close="editingMessage = null"
    />
    <div class="input-box" v-if="hasSendMessagePerm">
      <ButtonTemplate
        class="button"
        icon="attach_file"
        @click="$refs.sendFileBrowse.click()"
        v-if="!uploadFile && !editingMessageID"
      />

      <ButtonTemplate
        class="button"
        icon="close"
        :warn="true"
        v-else-if="editingMessageID"
        @click="editingMessage = null"
      />
      <ButtonTemplate
        class="button"
        icon="close"
        :warn="true"
        v-else-if="uploadFile"
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
        class="button doodle-button"
        v-if="!editingMessageID"
        @click="showDoodlePopout = !showDoodlePopout"
        icon="draw"
      />
      <ButtonTemplate
        class="button gif-button"
        icon="gif"
        @click="showGifPicker = !showGifPicker"
      />
      <ButtonTemplate
        class="button emoji-button"
        icon="tag_faces"
        @click="showEmojiPicker = !showEmojiPicker"
      />

      <div
        class="button-container"
        v-if="message.trim().length && editingMessageID"
      >
        <ButtonTemplate class="button" @click="sendMessage" icon="edit" />
        <span
          class="text-counter"
          :class="{ max: message.length > 5000 }"
          v-if="message.length > 4000"
          >{{ message.length }}<br />/<br />5000</span
        >
      </div>

      <ButtonTemplate
        class="button"
        v-else-if="!message.length && editingMessageID"
        @click="sendMessage"
        :warn="true"
        icon="delete"
      />
      <div
        class="button-container"
        v-else-if="message.trim().length || uploadFile"
      >
        <ButtonTemplate
          class="button"
          @click="sendMessage"
          :warn="message.length > 5000"
          :icon="uploadFile ? 'upload' : 'send'"
        />
        <span
          class="text-counter"
          :class="{ max: message.length > 5000 }"
          v-if="message.length > 4000"
          >{{ message.length }}<br />/<br />5000</span
        >
      </div>
    </div>
    <div class="no-perm" v-else>
      {{ $t("message-area.no-message-perm") }}
    </div>
  </div>
</template>

<script lang="ts">
import { FileUploadModule } from "@/store/modules/fileUpload";
import FileUpload from "./FileUpload.vue";
import SuggestionPopouts from "./suggestion-popouts/SuggestionPopouts.vue";
import TypingStatus from "./TypingStatus.vue";
import SelectedMessagesActions from "./SelectedMessagesActions.vue";
import ScrollDownButton from "./ScrollDownButton.vue";
import RateLimitPopup from "./RateLimitPopup.vue";
import ButtonTemplate from "./MessageBoxButtonTemplate.vue";
import EditPanel from "./EditPanel.vue";
import { MeModule } from "@/store/modules/me";
import { MessagesModule } from "@/store/modules/messages";
import { MessageInputModule } from "@/store/modules/messageInput";
import { defineAsyncComponent } from "vue";
import { useWindowProperties } from "@/utils/windowProperties";
import { editMessage, postTypingStatus } from "@/services/messagesService";
import Message from "@/interfaces/Message";
import { PopoutsModule } from "@/store/modules/popouts";
import { formatMessage } from "@/utils/formatMessage";
import { ChannelsModule } from "@/store/modules/channels";
import { ServerMembersModule } from "@/store/modules/serverMembers";
import { permissions } from "@/constants/rolePermissions";
import { ServersModule } from "@/store/modules/servers";
import {
  cacheInput,
  deleteInputCache,
  getInputCache,
} from "@/utils/inputCache";
import { MessageLogStatesModule } from "@/store/modules/messageLogStates";
import { TabsModule } from "@/store/modules/tabs";
import Channel from "@/interfaces/Channel";

const PickerArea = defineAsyncComponent(
  () => import("@/components/picker-area/PickerArea.vue")
);
const DoodlePopout = defineAsyncComponent(
  () => import("@/components/chat-area/DoodlePopout.vue")
);

import { defineComponent } from "vue";
export default defineComponent({
  components: {
    FileUpload,
    TypingStatus,
    EditPanel,
    ButtonTemplate,
    SuggestionPopouts,
    ScrollDownButton,
    RateLimitPopup,
    DoodlePopout,
    PickerArea,
    SelectedMessagesActions
  },
  data() {
    return {
      postTypingTimeout: null as number | null,
      saveInputTimeout: null as number | null,
      showEmojiPicker: false,
      showGifPicker: false,
      showDoodlePopout: false,
    };
  },
  mounted() {
    this.resizeTextArea();
    this.message = getInputCache(this.channelId) || "";
  },
  beforeUnmount() {
    this.stopPostingTypingStatus();
  },
  methods: {
    getTextarea() {
      return this.$refs.textarea as HTMLInputElement;
    },
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
    },
    onKeyUpEvent(event: KeyboardEvent) {
      (this.$refs.suggestionPopouts as any).onkeyUp(event);
    },
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
          (m) => m.creator.id === MeModule.user.id && !m.type && m.messageID
        );
        if (!message) return;
        if (!message.messageID) return;
        this.setEditMessage(undefined, message as Required<Message>);
        e.preventDefault();
        return;
      }
      if (e.key === "Escape" && this.editingMessage) {
        this.editingMessage = null;
        this.message = "";
      }
    },
    setEditMessage(messageID?: string, _message?: Required<Message>) {
      this.getTextarea().focus();
      const message =
        _message || this.channelMessages.find((m) => m.messageID === messageID);
      if (!message) return;
      FileUploadModule.SetFile(undefined);
      this.editingMessage = message;
    },
    sendMessage() {
      if (!this.channelMessages) return;
      this.getTextarea().focus();
      // format message before sending it.
      // replaces custom emoji names with emoji code n stuff
      if (this.message.length > 5000) return;
      const message = formatMessage(
        this.message,
        ChannelsModule.serverChannels(this.serverID || "")
      );

      if (this.editingMessageID) {
        this.editMessage(message);
        return;
      }

      if (!this.isImmune) {
        const now = Date.now();
        const timeLeft = ChannelsModule.rateLimitTimeLeft(this.channelId, now);
        if (this.rateLimit && timeLeft > 0) {
          return;
        }
      }
      if (!TabsModule.currentTab.opened) {
        TabsModule.openTab({ ...TabsModule.currentTab, opened: true });
      }

      deleteInputCache(this.channelId);

      if (this.uploadFile) {
        this.message = "";
        FileUploadModule.AddToQueue({
          channelId: this.$route.params.channel_id as string,
          message,
        });
        return;
      } else {
        if (!this.message.trim().length) return;
        this.message = "";
        MessagesModule.SendMessage({
          message,
          channelId: this.$route.params.channel_id as string,
        });
      }
    },

    editMessage(message: string) {
      if (!this.editingMessageID) return;
      const messageID = this.editingMessageID;
      const channelId = this.channelId;
      if (!this.message.length) {
        PopoutsModule.ShowPopout({
          component: "delete-message-popout",
          data: { messageID: this.editingMessageID, channelId: this.channelId },
          id: "delete-message",
        });
        return;
      }
      if (!TabsModule.currentTab.opened) {
        TabsModule.openTab({ ...TabsModule.currentTab, opened: true });
      }
      this.message = "";
      this.editingMessage = null;

      const findMessage = this.channelMessages.find(
        (e) => e.messageID === messageID
      );
      if (message.trim() === findMessage?.message) return;

      MessagesModule.UpdateMessage({
        channelId,
        messageID,
        message: {
          message,
          sending: 0,
        },
      });

      editMessage(messageID, channelId, { message })
        .then(() => {
          MessagesModule.UpdateMessage({
            channelId,
            messageID,
            message: {
              sending: 1,
              timeEdited: Date.now(),
            },
          });
        })
        .catch(() => {
          MessagesModule.UpdateMessage({
            channelId,
            messageID,
            message: {
              sending: 2,
              timeEdited: undefined,
            },
          });
        });
    },
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
    },
    stopPostingTypingStatus() {
      this.postTypingTimeout && clearTimeout(this.postTypingTimeout);
      this.postTypingTimeout = null;
    },

    attachmentChange(event: any) {
      const file: File = event.target.files[0];
      event.target.value = "";
      FileUploadModule.SetFile(file);
      (this.$refs["textarea"] as HTMLElement).focus();
    },
    removeAttachment() {
      FileUploadModule.SetFile(undefined);
    },
    async postTypingStatus() {
      if (!this.message.trim().length) {
        this.postTypingTimeout && clearTimeout(this.postTypingTimeout);
        this.postTypingTimeout = null;
        return;
      }
      if (this.postTypingTimeout) return;
      postTypingStatus(this.channelId);
      this.postTypingTimeout = window.setTimeout(() => {
        this.postTypingTimeout = null;
        if (!this.message.trim().length) return;
        this.postTypingStatus();
      }, 2000);
    },
  },
  watch: {
    message() {
      if (this.saveInputTimeout) {
        clearTimeout(this.saveInputTimeout);
      }
      this.saveInputTimeout = window.setTimeout(() => {
        cacheInput(this.channelId, this.message);
      }, 500);
      this.resizeTextArea();
      this.postTypingStatus();
    },
    channelId(after: string, before: string) {
      if (this.saveInputTimeout) {
        clearTimeout(this.saveInputTimeout);
      }
      cacheInput(before, this.message);

      this.message = getInputCache(after) || "";
      const textarea = this.getTextarea();

      window.setTimeout(() => {
        if (this.$isMobile) return;
        textarea.focus();
        textarea.setSelectionRange(
          textarea.value.length,
          textarea.value.length
        );
      }, 10);
      this.stopPostingTypingStatus();
    },

    isFocused() {
      if (!this.isFocused) {
        this.stopPostingTypingStatus();
      }
    },
    isConnected() {
      this.resizeTextArea();
    },
    editingMessageID() {
      this.getTextarea().focus();
    },
    windowWidthSize() {
      this.resizeTextArea();
    },
  },
  computed: {
    isImmune(): boolean | number {
      if (!this.serverID) return true;
      if (!MeModule.user.id) return false;
      if (ServersModule.isServerOwner(this.serverID, MeModule.user.id))
        return true;
      return ServerMembersModule.memberHasPermission(
        MeModule.user.id,
        this.serverID,
        permissions.ADMIN.value
      );
    },

    hasSendMessagePerm(): boolean | number {
      if (this.currentTab !== "servers") return true;
      if (!MeModule.user.id) return false;
      if (!this.serverID) return false;

      const isServerOwner = ServersModule.isServerOwner(
        this.serverID,
        MeModule.user.id
      );
      if (isServerOwner) return true;

      const isAdmin = ServerMembersModule.isAdmin(
        MeModule.user.id,
        this.serverID
      );
      if (isAdmin) return true;
      const hasRolePerm = ServerMembersModule.memberHasPermission(
        MeModule.user.id,
        this.serverID,
        permissions.SEND_MESSAGES.value,
        false
      );
      let hasChannelPerm = this.serverChannel?.permissions?.send_message;
      if (hasChannelPerm === undefined) hasChannelPerm = true;
      if (!hasChannelPerm) return false;
      return hasRolePerm;
    },
    placeholderMessage(): any {
      if (!this.isConnected) {
        return this.$t("message-area.not-connected-server");
      }
      if (this.uploadFile) {
        return this.$t("message-area.attach-message");
      }
      return this.$t("message-area.type-message");
    },
    isConnected(): boolean {
      return MeModule.connected;
    },
    isFocused(): boolean {
      return useWindowProperties().isFocused;
    },
    windowWidthSize(): number {
      return useWindowProperties().resizeWidth;
    },
    uploadFile(): File | undefined {
      return FileUploadModule.file.file;
    },
    channelId(): string {
      return this.$route.params.channel_id as string;
    },
    serverChannel(): Channel {
      return ChannelsModule.channels[this.channelId];
    },
    channelMessages(): Message[] {
      return MessagesModule.channelMessages(this.channelId);
    },
    message: {
      get(): string {
        return MessageInputModule.message;
      },
      set(val: string) {
        MessageInputModule.setMessage(val);
      },
    },
    serverID(): string | undefined {
      if (this.currentTab !== "servers") return undefined;
      return this.$route.params.server_id as string;
    },
    currentTab(): string {
      return this.$route.path.split("/")[2] || "";
    },
    editingMessageID(): string | undefined {
      return this.editingMessage?.messageID;
    },
    editingMessage: {
      get(): Message | null {
        return MessageInputModule.editingMessage;
      },
      set(val: Message) {
        MessageInputModule.SetEditingMessage(val);
      },
    },
    isScrolledDown(): boolean {
      return MessageLogStatesModule.isScrolledDown(this.channelId);
    },
    rateLimit(): number | undefined {
      return this.serverChannel?.rateLimit;
    },
  },
});
</script>

<style lang="scss" scoped>
.message-box {
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.05);

  flex-shrink: 0;
  min-height: 45px;
  position: relative;
  caret-color: var(--primary-color);
}
.text-counter {
  display: block;
  color: var(--warn-color);
  text-align: center;
  width: 100%;
  font-size: 12px;
  &.max {
    color: var(--alert-color);
  }
}

.input-box {
  display: flex;
  flex: 1;
  gap: 2px;
  margin-left: 2px;
  margin-right: 2px;
  place-items: center;
  min-height: 45px;
  flex-shrink: 0;
  .button {
    height: 40px;
    width: 50px;
  }
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
