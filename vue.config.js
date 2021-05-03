const fs = require("fs");
process.env.VUE_APP_VERSION = require("./public/changelog.json")[0].version;

process.env.VUE_APP_LAST_UI_BREAKING_VERSION = require("./public/changelog.json").find(
  v => v.tags?.includes("ui-breaking")
)?.version;

fs.writeFileSync(
  "./public/swenv.js",
  `
const process = {
  env: {
    apiKey: "${process.env.VUE_APP_FCM_API_KEY}",
    authDomain: "${process.env.VUE_APP_FCM_AUTH_DOMAIN}",
    databaseURL: "${process.env.VUE_APP_FCM_DATABASE_URL}",
    projectId: "${process.env.VUE_APP_FCM_PROJECT_ID}",
    storageBucket: "${process.env.VUE_APP_FCM_STORAGE_BUCKET}",
    messagingSenderId: "${process.env.VUE_APP_FCM_SENDER_ID}",
    appId: "${process.env.VUE_APP_FCM_APP_ID}",
    nertiviaCDN: "${process.env.VUE_APP_NERTIVIA_CDN}"

  }
}
`
);

module.exports = {
  transpileDependencies: ["vuex-module-decorators"],
  configureWebpack: {},

  pwa: {
    manifestOptions: {
      name: "Nertivia",
      short_name: "Nertivia",
      start_url: "/app"
    },
    themeColor: "#181c22",
    backgroundColor: "#222831"
  },

  pluginOptions: {
    i18n: {
      locale: "en",
      fallbackLocale: "en",
      localeDir: "locales",
      enableInSFC: false
    }
  }
};
