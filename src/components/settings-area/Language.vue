<template>
  <div class="language-area">
    <div class="box">
      <div class="description">
        <div class="material-icons">info</div>
        {{ $t("settings.tab-names.language") }}
      </div>
      <div class="notice">
        {{ $t("settings.language.details") }}
      </div>
      <div class="language-list">
        <div
          class="item"
          :class="{ selected: currentLang === obj.id }"
          @click="changeLanguage(obj.id)"
          v-for="obj in mappedLanguages"
          :key="obj.id"
        >
          <div class="flag" v-html="obj.flagImage"></div>
          <div class="details">
            <div class="name">{{ obj.name }}</div>
            <div class="translators">
              <span class="item-label"
                >{{ $t("settings.language.translators") }}:</span
              >
              <div
                class="translator"
                v-for="(translator, i) in obj.translators"
                :key="i"
              >
                <span>{{ translator }}</span>
                <span v-if="obj.translators.length !== i + 1">, </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import i18n from "@/i18n";
import languages from "@/locales/languages";
import emojiParser from "@/utils/emojiParser";

import { defineComponent } from "vue";
export default defineComponent({
  name: "Language",
  data() {
    return {
      languages: languages,
      currentLang: localStorage["locale"] || "en",
    };
  },
  computed: {
    mappedLanguages(): {
      id: any;
      name: any;
      flagImage: any;
      translators: any[];
    }[] {
      return Object.keys(languages).map((key) => {
        return {
          ...languages[key],
          id: key,
          flagImage: emojiParser.replaceEmojis(languages[key].unicode),
        };
      });
    },
  },
  methods: {
    // used for Welcome.vue popout.
    onNext() {
      this.$emit("onAction", true);
    },
    changeLanguage(id: string) {
      this.currentLang = id;
      localStorage.setItem("locale", id);
      if (id === "en") {
        this.$i18n.locale = "en";
        return;
      }
      import(`@/locales/${id}.json`).then((messages) => {
        i18n.global.setLocaleMessage(id, messages.default);
        this.$i18n.locale = id;
      });
    },
  },
});
</script>

<style lang="scss" scoped>
.language-area {
  display: flex;
  flex-direction: column;
  overflow: auto;
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
  margin-bottom: 10px;
}
.flag {
  flex-shrink: 0;
  width: 30px;
  height: 30px;
  margin-right: 5px;
  margin-left: 3px;
}
.translators {
  display: flex;
  gap: 5px;
  font-size: 14px;
}
.language-list {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.item {
  display: flex;
  align-items: center;
  align-content: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  padding: 5px;
  transition: 0.2s;
  cursor: pointer;
  user-select: none;
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  &.selected {
    background: var(--primary-color);
  }
}
.item-label {
  opacity: 0.8;
}
.title {
  margin-bottom: 5px;
}
.box {
  padding: 10px;
}
</style>
<style>
.flag .emoji {
  height: 100%;
  width: 100%;
}
</style>
