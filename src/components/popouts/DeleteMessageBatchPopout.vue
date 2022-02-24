<template>
  <div class="popout-background" @click="backgroundClick">
    <div class="delete-message-popout">
      <div class="content animate-in">
        <div class="header">
          <div class="text">
            Delete {{ selectedMessageIds.length }} Message(s)?
          </div>
        </div>
        <div class="inner-content">
          <div class="description">
            {{ selectedMessageIds.length }} messages are selected.
          </div>
          <div class="buttons">
            <CustomButton icon="close" :name="$t('back')" @click="close" />
            <CustomButton
              :disabled="requestSent"
              :name="$t('generic.delete')"
              @click="deleteMessages"
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
import { PopoutsModule } from "@/store/modules/popouts";
import CustomButton from "@/components/CustomButton.vue";
import { defineComponent } from "vue";
import { MessagesModule } from "@/store/modules/messages";
import { deleteMessages } from "@/services/messagesService";
export default defineComponent({
  name: "DeleteMessageBatch",
  components: {
    CustomButton,
  },
  data() {
    return {
      requestSent: false,
    };
  },
  computed: {
    selectedMessageIds() {
      return MessagesModule.selectedMessageIds;
    },
    channelId(): string {
      return this.$route.params.channel_id as string;
    },
  },
  methods: {
    close() {
      PopoutsModule.ClosePopout("delete-message-batch");
    },
    backgroundClick(event: any) {
      if (event.target.classList.contains("popout-background")) {
        this.close();
      }
    },
    async deleteMessages() {
      if (this.requestSent) return;
      this.requestSent = true;
      deleteMessages(this.channelId, this.selectedMessageIds).finally(() => {
        this.requestSent = false;
        MessagesModule.deselectAll();
        this.close();
      });
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
  height: 30px;
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
  display: flex;
  flex-direction: column;
  overflow: auto;
  margin: 10px;
  margin-top: 20px;
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
