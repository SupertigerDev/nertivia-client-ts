import { LastSeenServerChannelsModule } from "@/store/modules/lastSeenServerChannel";
import { NotificationsModule } from "@/store/modules/notifications";
import { ServersModule } from "@/store/modules/servers";
import { h } from "vue";
import { defineComponent } from "vue";
export default defineComponent({
  name: "BrowserIcoHandler",
  render() {
    return h("template");
  },
  computed: {
    serverNotificationCount(): any {
      return LastSeenServerChannelsModule.allServerNotifications.length;
    },
    anyMentionNotifications(): any {
      let notifPresent = false;
      for(let i = 0; i < LastSeenServerChannelsModule.allServerNotifications.length; i++) {
        const currentNotif = LastSeenServerChannelsModule.allServerNotifications[i];
        if(currentNotif.mentioned) {
          notifPresent = true;
        }
      }
      return notifPresent;
    },
    dmNotificationCount(): any {
      return NotificationsModule.allDMNotifications.length;
    },
  },
  watch: {
    serverNotificationCount: {
      handler: "onNotification",
    },
    dmNotificationCount: {
      handler: "onNotification",
    },
  },
  methods: {
    isMentionsOnly() {
      const state = localStorage["notificationMentionsOnly"];
      if (state === undefined) return false;
      return JSON.parse(state);
    },
    onNotification() {
      let condition =
        this.serverNotificationCount || this.dmNotificationCount;
      if(this.isMentionsOnly() && !this.anyMentionNotifications) {
        //No DM's present, then return.
        if(!(this.dmNotificationCount > 0)) {
          condition = 0;
        }
      }  
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
    },
  },
});