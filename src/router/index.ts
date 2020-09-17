import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import VueSocketIo from "vue-socket.io-extended";
import io from "socket.io-client";

import store from "../store/index";
import config from "../config";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: () => import(/* webpackChunkName: "home" */ "../views/Home.vue")
  },
  {
    path: "/app",
    children: [
      { path: "servers/:server_id?/:channel_id?" },
      { path: "dms/:channel_id?" },
      { path: "settings/" }
    ],
    name: "App",
    component: () =>
      import(/* webpackChunkName: "main-app" */ "../views/MainApp.vue"),
    beforeEnter(to, from, next) {
      Vue.use(VueSocketIo, io(config.socketIP, { autoConnect: false }), {
        store
      });
      next();
    }
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
