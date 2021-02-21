import { NOTIFICATION_DISMISS } from "@/socketEventConstants";
import { ActionTree } from "vuex";
import { LastSeenServerChannelsModule } from "../lastSeenServerChannel";
import { NotificationsModule } from "../notifications";

const actions: ActionTree<any, any> = {
  [NOTIFICATION_DISMISS](
    context,
    data: { channelID: string; serverNotification: boolean }
  ) {
    if (data.serverNotification) {
      LastSeenServerChannelsModule.SetLastSeenChannel(data.channelID);
    }
    NotificationsModule.DeleteNotification(data.channelID);
  }
};
export default {
  actions
};
