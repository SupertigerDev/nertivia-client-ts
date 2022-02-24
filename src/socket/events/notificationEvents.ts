import { LastSeenServerChannelsModule } from "@/store/modules/lastSeenServerChannel";
import { NotificationsModule } from "@/store/modules/notifications";

export const onNotificationDismiss = (data: {
  channelId: string;
  serverNotification: boolean;
}) => {
  if (data.serverNotification) {
    LastSeenServerChannelsModule.SetLastSeenChannel(data.channelId);
  }
  NotificationsModule.DeleteNotification(data.channelId);
};
