process.env.VUE_APP_VERSION = require("./public/changelog.json")[0].version;
module.exports = {
  transpileDependencies: ["vuex-module-decorators"],
  configureWebpack: {},
  pwa: {
    manifestOptions: {
      name: "Nertivia BETA",
      short_name: "Nertivia BETA",
      start_url: "/app"
    },
    themeColor: "#181c22",
    backgroundColor: "#222831"
  }
};
