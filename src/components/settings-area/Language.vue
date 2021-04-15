<template>
  <div class="notification">
    <div class="box">
      <div class="description">
        <div class="material-icons">info</div>
        Change the app language.
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
              <span class="item-label">Translators:</span>
              <div
                class="translator"
                v-for="(translators, i) in obj.translators"
                :key="i"
              >
                <span>{{ translators }}</span>
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
import { Component, Vue } from "vue-property-decorator";
import languages from "@/locales/languages.json";
import emojiParser from "@/utils/emojiParser";

@Component
export default class Language extends Vue {
  languages = languages;
  currentLang = localStorage["locale"] || "en";

  changeLanguage(id: string) {
    this.currentLang = id;
    localStorage.setItem("locale", id);
    if (id === "en") {
      this.$i18n.locale = "en";
      return;
    }
    import(`@/locales/${id}.json`).then(messages => {
      this.$i18n.setLocaleMessage(id, messages.default);
      this.$i18n.locale = id;
    });
  }
  get mappedLanguages() {
    return Object.keys(languages).map(key => {
      return {
        ...languages[key],
        id: key,
        flagImage: emojiParser.replaceEmojis(languages[key].unicode)
      };
    });
  }
}
</script>

<style lang="scss" scoped>
.notification {
  display: flex;
  flex-direction: column;
}
.description {
  display: flex;
  align-items: center;
  align-content: center;
  .material-icons {
    margin-right: 5px;
  }
  margin-bottom: 10px;
}
.flag {
  flex-shrink: 0;
  width: 30px;
  height: 30px;
  margin-right: 5px;
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
