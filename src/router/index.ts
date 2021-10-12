import { socket } from "@/socket";
import * as VueRouter from "vue-router";

const ExploreArea = () => import("../components/explore-area/ExploreArea.vue");
const AdminPanelArea = () =>
  import("../components/admin-panel-area/AdminPanelArea.vue");
const SettingsArea = () =>
  import("../components/settings-area/SettingsArea.vue");
const MessageArea = () => import("../components/chat-area/MessageArea.vue");
const DashboardArea = () =>
  import("../components/dashboard-area/DashboardArea.vue");
const ServerSettingsArea = () =>
  import("../components/server-settings-area/ServerSettingsArea.vue");
const PageNotFound = () => import("../views/PageNotFound.vue");

const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Home",
      component: () => import("../views/Home.vue"),
    },
    {
      path: "/privacy",
      name: "Privacy",
      component: () => import("../views/Privacy.vue"),
    },
    {
      path: "/bots/:botid",
      name: "Invite Bot",
      component: () => import("../views/InviteBot.vue"),
    },
    {
      path: "/invites/:inviteid",
      alias: ["/i/:inviteid"],
      name: "Invite Server",
      component: () => import("../views/InviteServer.vue"),
    },
    {
      path: "/terms-and-conditions",
      name: "TermsAndConditions",
      component: () => import("../views/TermsAndConditions.vue"),
    },
    {
      path: "/popout-css-editor",
      name: "CSSEditor",
      component: () =>
        import("../components/settings-area/interface/custom-css/Editor.vue"),
    },
    {
      // TODO: change the path someday
      path: "/GDrive_callback",
      name: "GoogleDriveCallback",
      component: () => import("../views/GoogleDriveCallback.vue"),
    },
    {
      path: "/login",
      name: "Login",
      component: () => import("../views/Login.vue"),
      beforeEnter(to, from, next) {
        if (localStorage["hauthid"]) {
          location.href = "/app";
          return;
        }
        next();
      },
    },
    {
      path: "/captcha",
      name: "Captcha",
      component: () => import("../views/CaptchaPage.vue"),
    },
    {
      path: "/reset-password",
      name: "Reset Password",
      component: () => import("../views/ResetPassword.vue"),
      beforeEnter(to, from, next) {
        if (localStorage["hauthid"]) {
          location.href = "/app";
          return;
        }
        next();
      },
    },
    {
      path: "/register",
      name: "Register",
      component: () => import("../views/Register.vue"),
      beforeEnter(to, from, next) {
        if (localStorage["hauthid"]) {
          location.href = "/app";
          return;
        }
        next();
      },
    },
    {
      path: "/app",
      children: [
        { path: "", component: DashboardArea },
        {
          path: "servers/:server_id/settings/:tab?/:id?",
          component: ServerSettingsArea,
          name: "server-settings",
        },
        {
          path: "servers/:server_id/:channel_id",
          component: MessageArea,
          name: "server-message-area",
        },
        {
          path: "dms/:channel_id",
          component: MessageArea,
          name: "dm-message-area",
        },
        { path: "servers/", component: DashboardArea },
        { path: "dms/", component: DashboardArea },
        { path: "settings/:tab?", component: SettingsArea },
        { path: "explore/:tab?", component: ExploreArea },
        { path: "admin-panel/:tab?", component: AdminPanelArea },
      ],
      name: "App",
      component: () => import("../views/MainApp.vue"),
      beforeEnter(to, from, next) {
        if (!localStorage["hauthid"]) {
          location.href = "/login";
          return;
        }
        next();
      },
    },
    { path: "/404", component: PageNotFound },
    { path: "/(.*)*", redirect: "/404" },
  ],
});

export default router;
