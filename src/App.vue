<template>
  <router-view />
</template>

<style lang="scss">
@import "@/styles/global.scss";
body {
  margin: 0;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #dddddd;
}
textarea {
  font-family: Avenir, Helvetica, Arial, sans-serif;
}
html,
body {
  height: 100%;
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
  background: $primary-color;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: $primary-color;
}
</style>
