<template>
  <div class="message-box">
    <div class="input-box">
      <textarea
        v-bind:value="message"
        @input="message = $event.target.value"
        ref="textarea"
        class="textarea"
        placeholder="Type your message"
      />
      <div class="material-icons send-button" v-if="message.trim().length">
        send
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";

@Component
export default class MessageBoxArea extends Vue {
  message = "";

  @Watch("message")
  messageChanged() {
    this.resizeTextArea();
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
}
</script>

<style lang="scss" scoped>
.message-box {
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  margin: 6px;
  margin-top: 0;
  flex-shrink: 0;
  min-height: 45px;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.3);
}

.input-box {
  display: flex;
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
.send-button {
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: flex-end;
  margin-bottom: 5px;
  font-size: 25px;
  color: white;
  margin-right: 5px;
  cursor: pointer;
  height: 35px;
  opacity: 0.8;
  width: 35px;
  border-radius: 5px;
  transition: 0.2s;
  user-select: none;
  &:hover {
    background: var(--primary-color);
    box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.6);
    opacity: 1;
  }
}
</style>
