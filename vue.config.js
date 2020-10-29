module.exports = {
  productionSourceMap: false,
  transpileDependencies: ["vuex-module-decorators"],
  configureWebpack: {},
  pwa: {
    manifestOptions: {
      start_url: "/app"
    },
    themeColor: "#181c22",
    backgroundColor: "#222831"
  }
};
