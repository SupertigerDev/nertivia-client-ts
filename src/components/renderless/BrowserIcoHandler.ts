import { LastSeenServerChannelsModule } from "@/store/modules/lastSeenServerChannel";
import { NotificationsModule } from "@/store/modules/notifications";
import { ServersModule } from "@/store/modules/servers";
import { Component, Vue, Watch } from "vue-property-decorator";

@Component
export default class BrowserIcoHandler extends Vue {
  render() {
    return null;
  }
  @Watch("serverNotificationCount")
  @Watch("dmNotificationCount")
  onNotification() {
    const condition = this.serverNotificationCount || this.dmNotificationCount;
    this.setNotificationICO(Boolean(condition));
  }

  setNotificationICO(set: boolean) {
    const icoSelector = document.querySelector("link[rel='icon']");
    if (set) {
      icoSelector?.setAttribute("href", "/img/icons/favicon-notification.ico");
      return;
    }
    icoSelector?.setAttribute("href", "/img/icons/favicon-32x32.png");
  }

  get serverNotificationCount() {
    return LastSeenServerChannelsModule.allServerNotifications.length;
  }
  get dmNotificationCount() {
    return NotificationsModule.allDMNotifications.length;
  }
}
