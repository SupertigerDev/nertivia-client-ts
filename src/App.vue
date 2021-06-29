<template>
  <div class="root">
    <WindowControl v-if="$isElectron" />
    <router-view />
    <Popouts />
  </div>
</template>

<script lang="ts">
const WindowControl = () =>
  import(
    /* webpackChunkName: "WindowControl" */ "@/components/electron/WindowControl.vue"
  );
import { Component, Vue } from "vue-property-decorator";
import Popouts from "@/components/popouts/Popouts.vue";

import {
  getCustomCssVars,
  changeCssVar,
  setThemeColor
} from "@/utils/customCssVars";
import { applyFont } from "./utils/applyFont";
import fonts from "@/utils/fonts.json";

@Component({ components: { WindowControl, Popouts } })
export default class App extends Vue {
  mounted() {
    // applyfont
    applyFont(localStorage["font"] || fonts[0].id);
    // set custom css colors
    const customVars = getCustomCssVars();
    for (let i = 0; i < Object.keys(customVars).length; i++) {
      const key = Object.keys(customVars)[i];
      const value = customVars[key];
      changeCssVar(key, value, false);
    }
    setThemeColor();
    this.setLocale();
  }
  setLocale() {
    const currentLocale = localStorage["locale"] || "en";
    if (currentLocale === "en") return;
    import(`@/locales/${currentLocale}.json`).then(messages => {
      this.$i18n.setLocaleMessage(currentLocale, messages.default);
      this.$i18n.locale = currentLocale;
    });
  }
}
</script>

<style lang="scss">
body {
  margin: 0;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: white;
}
textarea {
  font-family: Avenir, Helvetica, Arial, sans-serif;
}
html,
body,
.root {
  height: 100%;
  overflow: hidden;

  overscroll-behavior-x: none;
}
.root {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* width */
::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}

/* Track */
::-webkit-scrollbar-track {
  background: transparent;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: var(--primary-color);
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: var(--primary-color);
}
</style>
