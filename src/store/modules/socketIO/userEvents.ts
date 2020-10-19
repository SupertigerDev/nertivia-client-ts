import { ActionTree } from "vuex";
import { MeModule } from "../me";
import { PresencesModule } from "../presences";

const actions: ActionTree<any, any> = {
  socket_userStatusChange(context, data: { uniqueID: string; status: number }) {
    if (data.uniqueID === MeModule.user.uniqueID) {
      MeModule.UpdateUser({ status: data.status });
      return;
    }
    PresencesModule.UpdatePresence({
      presence: data.status,
      uniqueID: data.uniqueID
    });
  }
};
export default {
  actions
};
