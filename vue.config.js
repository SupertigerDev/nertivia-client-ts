module.exports = {
  productionSourceMap: false,
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
