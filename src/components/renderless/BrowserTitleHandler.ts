import { LastSeenServerChannelsModule } from "@/store/modules/lastSeenServerChannel";
import { NotificationsModule } from "@/store/modules/notifications";
import { ServersModule } from "@/store/modules/servers";
import { Component, Vue, Watch } from "vue-property-decorator";

@Component
export default class BrowserTitleHandler extends Vue {
  render() {
    return null;
  }
  @Watch("firstServerNotification")
  @Watch("firstDmNotification")
  onNotification() {
    this.setBrowserWindowTitle();
  }
  setBrowserWindowTitle() {
    // DM Notification
    if (this.firstDmNotification) {
      this.setNotificationICO(true);
      document.title = `(!) ${this.firstDmNotification.sender.username} - Nertivia`;
      return;
    }
    // Server Notification
    const notification: any = this.firstServerNotification;
    if (!notification?.server_id) {
      document.title = "Nertivia";
      this.setNotificationICO(false);
      return;
    }
    this.setNotificationICO(true);

    const server = ServersModule.servers[notification.server_id];
    document.title = `(!) ${server.name}#${notification.name} - Nertivia`;
  }
  setNotificationICO(set: boolean) {
    const icoSelector = document.querySelector("link[rel='icon']");
    if (set) {
      icoSelector?.setAttribute("href", "/img/icons/favicon-notification.ico");
      return;
    }
    icoSelector?.setAttribute("href", "/img/icons/favicon-32x32.png");
  }

  get firstServerNotification() {
    return LastSeenServerChannelsModule.allServerNotifications.sort(
      (a, b) => (b.lastMessaged || 0) - (a.lastMessaged || 0)
    )?.[0];
  }
  get firstDmNotification() {
    return NotificationsModule.allDMNotifications?.reverse()?.[0];
  }
}
