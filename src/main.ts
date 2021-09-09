import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import clickOutside from "./directives/clickOutside";
import clipboard from "vue-clipboard2";
import { applyDefaultTheme } from "./utils/customCssVars";
import { messagingSupported, messaging } from "./utils/firebaseInstance";
import { reportError } from "./services/userService";
import electronBridge from "./utils/electronBridge";
import i18n from "./i18n";

Vue.use(clipboard);

declare module "vue" {
  interface Vue {
    $isMobile: boolean;
    $version: string;
    $lastUIBreakingVersion: string;
    $isElectron: string;
    $window: Window;
  }
}

// compatible with old stinky browsers.
if (!String.prototype.replaceAll) {
  (String.prototype as any).replaceAll = String.prototype.replace;
}

if (messagingSupported && process.env.VUE_APP_FCM_API_KEY) {
  messaging().onMessage(payload => {
    console.log("FCM Data: ", payload);
  });
}
Vue.prototype.$isElectron = electronBridge?.isElectron || false;
Vue.prototype.$version = process.env.VUE_APP_VERSION;
Vue.prototype.$lastUIBreakingVersion =
  process.env.VUE_APP_LAST_UI_BREAKING_VERSION;
Vue.prototype.$isMobile = /iphone|ipod|android|ie|blackberry|fennec/.test(
  navigator.userAgent.toLowerCase()
);
Vue.prototype.$window = window;

applyDefaultTheme(false);

let cancelErrorReportingForever = false;
Vue.config.errorHandler = function(err) {
  console.error(err);
  // disable error prompt in dev.
  if ((window as any).webpackHotUpdate) return;
  if (cancelErrorReportingForever) return;
  const val = prompt(
    `An error has occurred.\n${err}\nWould you like to report it?\n\nType in the box the action you were trying to do:`
  );
  if (val === null) {
    cancelErrorReportingForever = true;
    return;
  }
  reportError(err, val).then(() => {
    alert("Report sent. Thank you!");
  });
};

Vue.config.productionTip = false;
Vue.directive("click-outside", clickOutside);
new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount("#app");
