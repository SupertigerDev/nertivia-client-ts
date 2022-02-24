import { LastSeenServerChannelsModule } from "@/store/modules/lastSeenServerChannel";
import { NotificationsModule } from "@/store/modules/notifications";

export const onNotificationDismiss = (data: {
  channelID: string;
  serverNotification: boolean;
}) => {
  if (data.serverNotification) {
    LastSeenServerChannelsModule.SetLastSeenChannel(data.channelID);
  }
  NotificationsModule.DeleteNotification(data.channelID);
};
