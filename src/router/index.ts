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
    path: "/login",
    name: "Login",
    component: () => import(/* webpackChunkName: "Login" */ "../views/Login.vue"),
    beforeEnter(to, from, next) {
      if (localStorage["hauthid"]) {
        location.href = "/app";
        return;
      };
      next();
    }
  },
  {
    path: "/app",
    children: [
      { path: "servers/:server_id?/:channel_id?" },
      { path: "dms/:channel_id?" },
      { path: "settings/:tab?" }
    ],
    name: "App",
    component: () =>
      import(/* webpackChunkName: "main-app" */ "../views/MainApp.vue"),
    beforeEnter(to, from, next) {
      if (!localStorage["hauthid"]) {
        location.href = "/login";
        return;
      };
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
