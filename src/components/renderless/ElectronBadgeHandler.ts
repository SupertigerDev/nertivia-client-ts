import { LastSeenServerChannelsModule } from "@/store/modules/lastSeenServerChannel";
import { NotificationsModule } from "@/store/modules/notifications";
import electronBridge from "@/utils/electronBridge";
import { Component, Vue, Watch } from "vue-property-decorator";


@Component
export default class ElectronBadgeHandler extends Vue {
  render() {
    return null
  }
  mounted() {
    electronBridge?.send("notification_badge", 0);
  }

  @Watch("firstServerNotification")
  @Watch("firstDmNotification")
  onNotification() {
    this.setElectronBadge();
  }

  setElectronBadge() {
    if (this.firstServerNotification || this.firstDmNotification) {
      electronBridge?.send("notification_badge", 1);
      return;
    }
    electronBridge?.send("notification_badge", 0);
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