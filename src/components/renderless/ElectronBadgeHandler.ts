import { LastSeenServerChannelsModule } from "@/store/modules/lastSeenServerChannel";
import { NotificationsModule } from "@/store/modules/notifications";
import electronBridge from "@/utils/electronBridge";

import { defineComponent, h } from "vue";
export default defineComponent({
  name: "ElectronBadgeHandler",
  render() {
    return h("template");
  },
  computed: {
    firstServerNotification(): any {
      return LastSeenServerChannelsModule.allServerNotifications.sort(
        (a, b) => (b.lastMessaged || 0) - (a.lastMessaged || 0)
      )?.[0];
    },
    firstDmNotification(): any {
      return NotificationsModule.allDMNotifications?.reverse()?.[0];
    }
  },
  watch: {
    firstServerNotification: {
      handler: "onNotification"
    },
    firstDmNotification: {
      handler: "onNotification"
    }
  },
  mounted() {
    electronBridge?.send("notification_badge", 0);
  },
  methods: {
    onNotification() {
      this.setElectronBadge();
    },
    setElectronBadge() {
      if (this.firstServerNotification || this.firstDmNotification) {
        electronBridge?.send("notification_badge", 1);
        return;
      }
      electronBridge?.send("notification_badge", 0);
    }
  }
});
