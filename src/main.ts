import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import clickOutside from "./directives/clickOutside";
import clipboard from "vue-clipboard2";
import { applyDefaultTheme } from "./utils/customCssVars";
import { messaging } from "./utils/firebaseInstance";


Vue.use(clipboard);


messaging().onMessage(payload => {
  console.log("FCM Data: ", payload);
});
Vue.prototype.$isMobile = /iphone|ipod|android|ie|blackberry|fennec/.test(
  navigator.userAgent.toLowerCase()
);

applyDefaultTheme(false);

Vue.config.productionTip = false;
Vue.directive("click-outside", clickOutside);
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
