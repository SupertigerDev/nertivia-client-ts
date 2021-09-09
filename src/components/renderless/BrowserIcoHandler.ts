import { LastSeenServerChannelsModule } from "@/store/modules/lastSeenServerChannel";
import { NotificationsModule } from "@/store/modules/notifications";
import { ServersModule } from "@/store/modules/servers";
import Vue from "vue";
import { defineComponent } from "vue";
export default defineComponent({
  name: "BrowserIcoHandler",
  render(h) {
    return h("template");
  },
  computed: {
    serverNotificationCount(): any {
      return LastSeenServerChannelsModule.allServerNotifications.length;
    },
    dmNotificationCount(): any {
      return NotificationsModule.allDMNotifications.length;
    }
  },
  watch: {
    serverNotificationCount: {
      handler: "onNotification"
    },
    dmNotificationCount: {
      handler: "onNotification"
    }
  },
  methods: {
    onNotification() {
      const condition =
        this.serverNotificationCount || this.dmNotificationCount;
      this.setNotificationICO(Boolean(condition));
    },
    setNotificationICO(set: boolean) {
      const icoSelector = document.querySelector("link[rel='icon']");
      if (set) {
        icoSelector?.setAttribute(
          "href",
          "/img/icons/favicon-notification.ico"
        );
        return;
      }
      icoSelector?.setAttribute("href", "/img/icons/favicon-32x32.png");
    }
  }
});
