import Vue from "vue";
import { createI18n } from 'vue-i18n'
import messages from "@/locales/en.json";



const i18n  = createI18n({
  legacy: true,
  locale: process.env.VUE_APP_I18N_LOCALE || "en",
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || "en",
  messages: { en: messages }
})

export default i18n;
 
