<template>
  <div class="container manage-emojis">
    <div class="inner-container">
      <div class="details">
        <div class="description">
          <div class="material-icons">info</div>
          {{ $t("settings.tab-names.manage-emojis") }}
        </div>
        <div class="notice">
          {{ $t("settings.manage-emojis.details") }}
          <div>{{ $t("settings.manage-emojis.supported-types") }}</div>
        </div>
      </div>
      <CustomButton
        class="add-button"
        :name="$t('settings.manage-emojis.add-emojis-button')"
        icon="add"
        @click="$refs.addEmoji.click()"
        :filled="true"
      />
      <input
        multiple
        ref="addEmoji"
        style="display: none"
        type="file"
        @change="addEmoji"
        accept=".jpeg, .jpg, .png, .gif"
      />
      <div class="emoji-count">
        Emojis: <span>{{ count }}/50</span>
      </div>
      <div class="list">
        <EmojiTemplate
          v-for="(emoji, i) in emojiArr"
          :key="emoji.id"
          :defaultFocused="i === 0"
          :emoji="emoji"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { CustomEmojisModule } from "@/store/modules/customEmojis";
import CustomButton from "@/components/CustomButton.vue";
import EmojiTemplate from "./EmojiTemplate.vue";
import { PopoutsModule } from "@/store/modules/popouts";
import emojiParser from "@/utils/emojiParser";
import { uploadEmoji } from "@/services/emojiService";

function basename(path: string) {
  return path.substring(path.lastIndexOf("/") + 1);
}

function extname(path: string) {
  return path.substring(path.lastIndexOf("."), path.length);
}

import { defineComponent } from "vue";
export default defineComponent({
  name: "ManageEmojis",
  components: { EmojiTemplate, CustomButton },
  computed: {
    emojiArr(): any {
      return [...CustomEmojisModule.customEmojis].reverse();
    },
    count(): any {
      return this.emojiArr.length;
    },
  },
  methods: {
    // used for Welcome.vue popout.
    onNext() {
      this.$emit("onAction", true);
    },
    async addEmoji(event: any) {
      const files: File[] = [...event.target.files];
      event.target.value = "";
      if (!files.length) return;
      if (files.length > 10) {
        this.showError(`Please select less than 10 files.`);
        return;
      }
      const allowedFormats = [".png", ".jpeg", ".gif", ".jpg"];
      for (let index = 0; index < files.length; index++) {
        const file = files[index];
        if (!allowedFormats.includes(extname(file.name).toLowerCase())) {
          // TODO: localize this
          this.showError(
            `Upload failed - ${file.name} Unsupported image type.`
          );
          break;
        }
        if (file.size >= 3048576) {
          // 3048576 = 3mb
          this.showError(
            `Upload failed - ${file.name} Image size must be less than 3 megabytes.`
          );
          break;
        }
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const reader = await this.loadReader(file).catch(() => {});
        if (!reader) break;
        let failed = false;
        await this.uploadEmoji(file, reader).catch(() => {
          failed = true;
        });
        if (failed) break;
      }
    },
    loadReader(file: File): Promise<FileReader> {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const _this = this;
      return new Promise((res, rej) => {
        const reader = new FileReader();
        reader.onload = function () {
          res(reader);
        };
        reader.onerror = function (error) {
          console.log("Error: ", error);
          _this.showError("Something went wrong. Try again later.");
          rej();
        };
        reader.readAsDataURL(file);
      });
    },
    uploadEmoji(file: File, reader: FileReader) {
      let name = basename(file.name);
      name = this.uploadEmojiName(name);
      return uploadEmoji(name, reader.result as any);
    },
    showError(message: string) {
      PopoutsModule.ShowPopout({
        id: "custom-emoji-upload-error",
        component: "generic-popout",
        data: {
          title: "Oops!",
          description: message,
        },
      });
    },
    uploadEmojiName(name: string) {
      name = name.substring(0, 30).replace(/[^A-Z0-9]+/gi, "_");
      //check if emoji name is already used by twemoji
      const emojiExists = emojiParser.allEmojis.find((e) =>
        e.shortcodes.find((s) => s === name.toLowerCase())
      );
      //check if emoji name is already used by custom emojis
      const customEmojiExists = CustomEmojisModule.customEmojis.find(
        (e) => e.name.toLowerCase() === name.toLowerCase()
      );
      if (emojiExists || customEmojiExists) {
        name = this.uploadEmojiName(`${name.substring(0, 28)}_1`);
      }
      return name;
    },
  },
});
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  flex: 1;
}
.inner-container {
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: hidden;
}
.details {
  margin: 10px;
}
.description {
  display: flex;
  align-items: center;
  align-content: center;
  .material-icons {
    margin-right: 5px;
  }
}
.notice {
  color: rgba(255, 255, 255, 0.6);
  margin-left: 30px;
}
.emoji-count {
  margin-left: 10px;
  margin-top: 10px;
  color: rgba(255, 255, 255, 0.7);
  span {
    color: white;
  }
}
.list {
  overflow: auto;
  padding: 10px;
}
.add-button {
  align-self: flex-start;
}
</style>
