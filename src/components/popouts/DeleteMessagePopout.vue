<template>
  <div class="popout-background" @click="backgroundClick">
    <div class="delete-message-popout">
      <div class="content animate-in">
        <div class="header">
          <AvatarImage
            :imageId="user.avatar"
            :seedId="user.id"
            :animateGif="false"
            size="30px"
            class="avatar"
          />
          <div class="text">Delete Message?</div>
        </div>
        <div class="inner-content">
          <div class="description">
            <component
              v-bind:is="messageType"
              class="message"
              :message="message"
              :hideContext="true"
            />
          </div>
          <div class="buttons">
            <CustomButton icon="close" :name="$t('back')" @click="close" />
            <CustomButton
              :name="$t('generic.delete')"
              @click="deleteMessage"
              icon="delete"
              :alert="true"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import AvatarImage from "@/components/AvatarImage.vue";
import MessageTemplate from "@/components/chat-area/message/MessageTemplate.vue";
import ActionMessageTemplate from "@/components/chat-area/message/ActionMessageTemplate.vue";
import { PopoutsModule } from "@/store/modules/popouts";
import { deleteMessage } from "@/services/messagesService";
import { MessagesModule } from "@/store/modules/messages";
import CustomButton from "@/components/CustomButton.vue";
import { PropType } from "vue";
import { defineComponent } from "vue";
export default defineComponent({
  name: "ProfilePopout",
  components: {
    AvatarImage,
    MessageTemplate,
    ActionMessageTemplate,
    CustomButton,
  },
  props: {
    data: {
      type: Object as PropType<{
        messageID: string;
        channelId: string;
        callback?: any;
      }>,
      required: true,
    },
  },
  computed: {
    message(): any {
      return MessagesModule.channelMessages(this.data.channelId)?.find(
        (m) => m.messageID === this.data.messageID
      );
    },
    messageType(): any {
      return this.message?.type === 0
        ? "MessageTemplate"
        : "ActionMessageTemplate";
    },
    user(): any {
      if (!this.message) return undefined;
      return this.message.creator;
    },
  },
  watch: {
    message: {
      handler: "onMessageChange",
    },
  },
  methods: {
    close() {
      PopoutsModule.ClosePopout("delete-message");
    },
    backgroundClick(event: any) {
      if (event.target.classList.contains("popout-background")) {
        this.close();
      }
    },
    async deleteMessage() {
      if (!this.message) return;
      if (!this.message.messageID) return;
      this.close();
      await deleteMessage(this.message.channelId, this.message.messageID);
      this.data?.callback?.();
    },
    onMessageChange() {
      if (!this.message) {
        this.close();
      }
    },
  },
});
</script>
<style lang="scss" scoped>
.delete-message-popout {
  background: var(--popout-color);
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  max-height: 400px;
  max-width: 600px;
}

.animate-in {
  opacity: 0;
  animation: showUp 0.2s;
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

.popout-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.658);
  z-index: 99999999999999999999999999999;
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: center;
  pointer-events: all;
}
.header {
  display: flex;
  align-items: center;
  align-content: center;
  padding: 5px;
  background: var(--main-header-bg-color);
  .text {
    margin-left: 10px;
  }
}
.content {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.inner-content {
  display: flex;
  flex-direction: column;
  overflow: auto;
  align-items: center;
}
.description {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  overflow: auto;
}
.buttons {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  align-content: center;
  justify-content: center;
  margin-top: 10px;
  margin-bottom: 5px;
}
</style>
