import { ActionTree } from "vuex";
import { LastSeenServerChannelsModule } from "../lastSeenServerChannel";
import { NotificationsModule } from "../notifications";

const actions: ActionTree<any, any> = {
  ["socket_notification:dismiss"](
    context,
    data: { channelID: string; serverNotification: boolean }
  ) {
    if (data.serverNotification) {
      LastSeenServerChannelsModule.SetLastSeenChannel(data.channelID);
      return;
    }
    NotificationsModule.DeleteNotification(data.channelID);
  }
};
export default {
  actions
};
