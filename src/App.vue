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
import Popouts from "@/components/popouts/Popouts.vue";

import {
  getCustomCssVars,
  changeCssVar,
  setThemeColor
} from "@/utils/customCssVars";
import { applyFont } from "./utils/applyFont";
import fonts from "@/utils/fonts.json";
import { clear } from "idb-keyval";
import Vue from "vue";
import { defineComponent } from "vue";
export default defineComponent({
  name: "App",
  components: { WindowControl, Popouts },
  mounted() {
    if (!localStorage["hauthid"]) {
      clear();
    }
    // applyfont
    applyFont(localStorage["font"] || Object.values(fonts)[0].id);
    // set custom css colors
    const customVars = getCustomCssVars();
    for (let i = 0; i < Object.keys(customVars).length; i++) {
      const key = Object.keys(customVars)[i];
      const value = customVars[key];
      changeCssVar(key, value, false);
    }
    setThemeColor();
    this.setLocale();
  },
  methods: {
    setLocale() {
      const currentLocale = localStorage["locale"] || "en";
      if (currentLocale === "en") return;
      import(`@/locales/${currentLocale}.json`).then(messages => {
        this.$i18n.setLocaleMessage(currentLocale, messages.default);
        this.$i18n.locale = currentLocale;
      });
    }
  }
});
</script>

<style lang="scss">
body {
  margin: 0;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: white;
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
