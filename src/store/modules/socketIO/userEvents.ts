import { ActionTree } from "vuex";
import { MeModule } from "../me";
import { PresencesModule } from "../presences";

const actions: ActionTree<any, any> = {
  socket_userStatusChange(context, data: { uniqueID: string; status: number }) {
    if (data.uniqueID === MeModule.user.uniqueID) return;
    PresencesModule.UpdatePresence({
      presence: data.status,
      uniqueID: data.uniqueID
    });
  },
  socket_multiDeviceStatus(context, data: { status: number }) {
    MeModule.UpdateUser({ status: data.status });
  },
  socket_multiDeviceCustomStatus(context, data: { custom_status: string }) {
    MeModule.UpdateUser({ custom_status: data.custom_status });
  }
};
export default {
  actions
};
