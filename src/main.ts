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

Vue.use(clipboard);

declare module 'vue/types/vue' {
  interface Vue {
    $isMobile: boolean
    $version: string
    $test: string
  }
}


if (messagingSupported) {
  messaging().onMessage(payload => {
    console.log("FCM Data: ", payload);
  });
}
Vue.prototype.$version = process.env.VUE_APP_VERSION
Vue.prototype.$isMobile = /iphone|ipod|android|ie|blackberry|fennec/.test(
  navigator.userAgent.toLowerCase()
);

applyDefaultTheme(false);

let cancelErrorReportingForever = false;
Vue.config.errorHandler = function(err, vm, info) {
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
  render: h => h(App)
}).$mount("#app");
