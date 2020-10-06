<template>
  <router-view />
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { getCustomCssVars, changeCssVar } from "@/utils/customCssVars";
@Component
export default class App extends Vue {
  mounted() {
    // set custom css colors
    const customVars = getCustomCssVars();
    for (let i = 0; i < Object.keys(customVars).length; i++) {
      const key = Object.keys(customVars)[i];
      const value = customVars[key];
      changeCssVar(key, value, false);
    }
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
body {
  height: 100%;
  overflow: hidden;
}

/* width */
::-webkit-scrollbar {
  width: 5px;
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
