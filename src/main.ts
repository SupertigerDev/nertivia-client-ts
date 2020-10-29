import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import PortalVue from "portal-vue";
import clickOutside from "./directives/clickOutside";
import clipboard from "vue-clipboard2";

Vue.use(PortalVue);
Vue.use(clipboard);

Vue.config.productionTip = false;
Vue.directive("click-outside", clickOutside);
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
