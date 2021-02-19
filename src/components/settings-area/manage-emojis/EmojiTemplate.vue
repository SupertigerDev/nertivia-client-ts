<template>
  <div class="emoji-template" :class="{ focused }">
    <div class="image"><img :src="url" /></div>
    <div class="input">
      <input
        type="text"
        v-model="emojiName"
        @focus="focused = true"
        @blur="focused = false"
        @keydown="keyDown"
        ref="input"
      />
    </div>
    <div
      class="material-icons button"
      v-if="nameChanged && !saving && !deleting"
      @click="saveButton"
    >
      save
    </div>
    <img src="@/assets/spinner.svg" v-if="saving || deleting" class="spinner" />
    <div
      class="material-icons button warn"
      v-if="!deleting && !saving"
      @click="deleteButton"
    >
      delete
    </div>
  </div>
</template>
<script lang="ts">
import config from "@/config";
import CustomEmoji from "@/interfaces/CustomEmoji";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

@Component
export default class EmojiTemplate extends Vue {
  @Prop() private emoji!: CustomEmoji;
  @Prop() private defaultFocused!: boolean;
  focused = this.defaultFocused || false;
  saving = false;
  deleting = false;
  emojiName = this.emoji.name;
  mounted() {
    if (this.focused) {
      (this.$refs.input as HTMLElement).focus();
    }
  }
  saveButton() {
    if (this.saving) return;
    this.saving = true;
  }
  deleteButton() {
    if (this.deleting) return;
    this.deleting = true;
  }
  keyDown(event: KeyboardEvent) {
    if (event.key === "Enter") {
      this.saveButton();
    }
  }
  @Watch("emojiName")
  onInput(val: string) {
    this.emojiName = val.replace(/[^A-Z0-9]+/gi, "_").trim();
  }
  get url() {
    return (
      config.nertiviaCDN +
      "emojis/" +
      this.emoji.emojiID +
      (this.emoji.gif ? ".gif" : ".png")
    );
  }
  get nameChanged() {
    return this.emojiName.trim() !== this.emoji.name;
  }
}
</script>

<style lang="scss" scoped>
.emoji-template {
  display: flex;
  margin-top: 2px;
  margin-bottom: 2px;
  align-content: center;
  align-items: center;
  transition: 0.2s;
  border: solid 2px transparent;
  &.focused {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
    border: solid 2px var(--primary-color);
  }
}
.image {
  height: 40px;
  width: 40px;
  margin: 5px;
  flex-shrink: 0;
  img {
    object-fit: contain;
    width: 100%;
    height: 100%;
  }
}
.input {
  display: flex;
  flex-direction: column;
  flex: 1;
  align-self: stretch;
  input {
    height: 100%;
    background: transparent;
    color: rgba(255, 255, 255, 0.6);
    outline: none;
    border: none;
    transition: 0.2s;
    padding-left: 5px;
    &:focus {
      color: white;
    }
  }
}
.spinner {
  width: 34px;
  height: 34px;
  flex-shrink: 0;
}
.button {
  margin: 5px;
  flex-shrink: 0;
  cursor: pointer;
  user-select: none;
  color: var(--primary-color);
  &.warn {
    color: var(--alert-color);
  }
}
</style>
