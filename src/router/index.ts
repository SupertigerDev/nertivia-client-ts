import Vue from "vue";
import * as VueRouter from "vue-router";
import VueSocketIOExt from "vue-socket.io-extended";
import { io } from "socket.io-client";

import store from "../store/index";

const ExploreArea = () =>
  import(
    /* webpackChunkName: "ExploreArea" */ "../components/explore-area/ExploreArea.vue"
  );
const AdminPanelArea = () =>
  import(
    /* webpackChunkName: "AdminPanelArea" */ "../components/admin-panel-area/AdminPanelArea.vue"
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
const PageNotFound = () =>
  import(/* webpackChunkName: "PageNotFound" */ "../views/PageNotFound.vue");

const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Home",
      component: () =>
        import(/* webpackChunkName: "home" */ "../views/Home.vue")
    },
    {
      path: "/privacy",
      name: "Privacy",
      component: () =>
        import(/* webpackChunkName: "Privacy" */ "../views/Privacy.vue")
    },
    {
      path: "/bots/:botid",
      name: "Invite Bot",
      component: () =>
        import(/* webpackChunkName: "InviteBot" */ "../views/InviteBot.vue")
    },
    {
      path: "/invites/:inviteid",
      alias: ["/i/:inviteid"],
      name: "Invite Server",
      component: () =>
        import(
          /* webpackChunkName: "InviteServer" */ "../views/InviteServer.vue"
        )
    },
    {
      path: "/terms-and-conditions",
      name: "TermsAndConditions",
      component: () =>
        import(
          /* webpackChunkName: "TermsAndConditions" */ "../views/TermsAndConditions.vue"
        )
    },
    {
      path: "/popout-css-editor",
      name: "CSSEditor",
      component: () =>
        import(
          /* webpackChunkName: "CSSEditor" */ "../components/settings-area/interface/custom-css/Editor.vue"
        )
    },
    {
      // TODO: change the path someday
      path: "/GDrive_callback",
      name: "GoogleDriveCallback",
      component: () =>
        import(
          /* webpackChunkName: "GoogleDriveCallback" */ "../views/GoogleDriveCallback.vue"
        )
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
        import(
          /* webpackChunkName: "ResetPassword" */ "../views/ResetPassword.vue"
        ),
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
          path: "servers/:server_id/settings/:tab?/:id?",
          component: ServerSettingsArea,
          name: "server-settings"
        },
        {
          path: "servers/:server_id/:channel_id",
          component: MessageArea,
          name: "message-area"
        },
        {
          path: "dms/:channel_id",
          component: MessageArea,
          name: "message-area"
        },
        { path: "servers/", component: DashboardArea },
        { path: "dms/", component: DashboardArea },
        { path: "settings/:tab?", component: SettingsArea },
        { path: "explore/:tab?", component: ExploreArea },
        { path: "admin-panel/:tab?", component: AdminPanelArea },
        { path: "/", component: DashboardArea }
      ],
      name: "App",
      component: () =>
        import(/* webpackChunkName: "main-app" */ "../views/MainApp.vue"),
      beforeEnter(to, from, next) {
        if (!localStorage["hauthid"]) {
          location.href = "/login";
          return;
        }
        // Vue.use(
        //   VueSocketIOExt,
        //   io(process.env.VUE_APP_SOCKET_URL || "", {
        //     autoConnect: false,
        //     transports: ["websocket"]
        //   })
        // );
        next();
      }
    },
    { path: "/404", component: PageNotFound },
    { path: "/(.*)*", redirect: "/404" }
  ]
});

export default router;
