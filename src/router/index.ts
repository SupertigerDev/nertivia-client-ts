import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import VueSocketIo from "vue-socket.io-extended";
import io from "socket.io-client";

import store from "../store/index";
import config from "../config";

const ExploreArea = () =>
  import(
    /* webpackChunkName: "ExploreArea" */ "../components/explore-area/ExploreArea.vue"
  );
const SettingsArea = () =>
  import(
    /* webpackChunkName: "SettingsArea" */ "../components/settings-area/SettingsArea.vue"
  );
const MessageArea = () =>
  import(
    /* webpackChunkName: "MessageArea" */ "../components/chat-area/MessageArea.vue"
  );
const DashboardArea = () =>
  import(
    /* webpackChunkName: "DashboardArea" */ "../components/dashboard-area/DashboardArea.vue"
  );
const ServerSettingsArea = () =>
  import(
    /* webpackChunkName: "ServerSettingsArea" */ "../components/server-settings-area/ServerSettingsArea.vue"
  );

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: () => import(/* webpackChunkName: "home" */ "../views/Home.vue")
  },
  {
    // TODO: change the path someday
    path: "/GDrive_callback",
    name: "GoogleDriveCallback",
    component: () => import(/* webpackChunkName: "GoogleDriveCallback" */ "../views/GoogleDriveCallback.vue")
  },
  {
    path: "/login",
    name: "Login",
    component: () =>
      import(/* webpackChunkName: "Login" */ "../views/Login.vue"),
    beforeEnter(to, from, next) {
      if (localStorage["hauthid"]) {
        location.href = "/app";
        return;
      }
      next();
    }
  },
  {
    path: "/reset-password",
    name: "Reset Password",
    component: () =>
      import(/* webpackChunkName: "ResetPassword" */ "../views/ResetPassword.vue"),
    beforeEnter(to, from, next) {
      if (localStorage["hauthid"]) {
        location.href = "/app";
        return;
      }
      next();
    }
  },
  {
    path: "/register",
    name: "Register",
    component: () =>
      import(/* webpackChunkName: "Register" */ "../views/Register.vue"),
    beforeEnter(to, from, next) {
      if (localStorage["hauthid"]) {
        location.href = "/app";
        return;
      }
      next();
    }
  },
  {
    path: "/app",
    children: [
      {
        path: "servers/:server_id/settings/:tab?",
        component: ServerSettingsArea,
        name: "server-settings"
      },
      {
        path: "servers/:server_id/:channel_id",
        component: MessageArea,
        name: "message-area"
      },
      { path: "dms/:channel_id", component: MessageArea, name: "message-area" },
      { path: "servers/", component: DashboardArea },
      { path: "dms/", component: DashboardArea },
      { path: "settings/:tab?", component: SettingsArea },
      { path: "explore", component: ExploreArea },
      { path: "/", component: DashboardArea },
      { path: "*" }
    ],
    name: "App",
    component: () =>
      import(/* webpackChunkName: "main-app" */ "../views/MainApp.vue"),
    beforeEnter(to, from, next) {
      if (!localStorage["hauthid"]) {
        location.href = "/login";
        return;
      }
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
