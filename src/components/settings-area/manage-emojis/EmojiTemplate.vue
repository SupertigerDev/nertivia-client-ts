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
import CustomEmoji from "@/interfaces/CustomEmoji";
import { deleteEmoji, updateEmoji } from "@/services/emojiService";
import { CustomEmojisModule } from "@/store/modules/customEmojis";
import { PopoutsModule } from "@/store/modules/popouts";
import emojiParser from "@/utils/emojiParser";
import { PropType } from "vue";
import { defineComponent } from "vue";
export default defineComponent({
  name: "EmojiTemplate",
  props: {
    emoji: {
      type: Object as PropType<CustomEmoji>,
      required: true,
    },
    defaultFocused: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      focused: this.defaultFocused || false,
      saving: false,
      deleting: false,
      emojiName: this.emoji.name,
    };
  },
  computed: {
    url(): any {
      return (
        process.env.VUE_APP_NERTIVIA_CDN +
        "emojis/" +
        this.emoji.id +
        (this.emoji.gif ? ".gif" : ".png")
      );
    },
    nameChanged(): any {
      return this.emojiName.trim() !== this.emoji.name;
    },
  },
  watch: {
    emojiName: {
      handler: "onInput",
    },
  },
  mounted() {
    if (this.focused) {
      (this.$refs.input as HTMLElement).focus();
    }
  },
  methods: {
    saveButton() {
      const emojiExists = emojiParser.allEmojis.filter((e) =>
        e.shortcodes.find((s) => s === this.emojiName.toLowerCase())
      );
      //check if emoji name is already used by custom emojis
      const customEmojiExists = CustomEmojisModule.customEmojis.filter(
        (e) => e.name.toLowerCase() === this.emojiName.toLowerCase()
      );
      if (emojiExists.length > 1 || customEmojiExists.length > 1) {
        PopoutsModule.ShowPopout({
          id: "custom-emoji-save-error",
          component: "generic-popout",
          data: {
            title: "Oops!",
            description: "Emoji with this name already exists.",
          },
        });
        return;
      }

      if (this.saving) return;
      this.saving = true;
      updateEmoji(this.emoji.id, this.emojiName)
        .then(() => {
          CustomEmojisModule.UpdateEmoji({
            id: this.emoji.id,
            name: this.emojiName,
          });
          this.emojiName = this.emoji.name;

          this.saving = false;
        })
        .catch(async (res) => {
          let message;
          if (res.response) {
            message = (await res.response.json()).message;
          } else {
            message = this.$t("could-not-connect-to-server");
          }
          PopoutsModule.ShowPopout({
            id: "custom-emoji-save-error",
            component: "generic-popout",
            data: {
              title: "Oops!",
              description: message,
            },
          });
          this.saving = false;
        });
    },
    deleteButton() {
      if (this.deleting) return;
      this.deleting = true;
      deleteEmoji(this.emoji.id)
        .then(() => {
          CustomEmojisModule.DeleteEmoji(this.emoji.id);
        })
        .catch(async (res) => {
          let message;
          if (res.response) {
            message = (await res.response.json()).message;
          } else {
            message = this.$t("could-not-connect-to-server");
          }
          PopoutsModule.ShowPopout({
            id: "custom-emoji-delete-error",
            component: "generic-popout",
            data: {
              title: "Oops!",
              description: message,
            },
          });
          this.deleting = false;
        });
    },
    keyDown(event: KeyboardEvent) {
      if (event.key === "Enter") {
        this.saveButton();
      }
    },
    onInput(val: string) {
      this.emojiName = val.replace(/[^A-Z0-9]+/gi, "_").trim();
    },
  },
});
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
