<template>
  <div class="root">
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
  mounted() {
    this.t;
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
