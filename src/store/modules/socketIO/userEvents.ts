import { ActionTree } from "vuex";
import { MeModule } from "../me";
import { CustomStatusesModule } from "../memberCustomStatus";
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
  ["socket_member:customStatusChange"](context, data: {custom_status: string; uniqueID: string}) {
    CustomStatusesModule.SetCustomStatus({custom_status: data.custom_status, uniqueID: data.uniqueID})
  },
  socket_multiDeviceCustomStatus(context, data: { custom_status: string }) {
    if (!MeModule.user.uniqueID) return;
    CustomStatusesModule.SetCustomStatus({custom_status: data.custom_status, uniqueID: MeModule.user.uniqueID})
  }
};
export default {
  actions
};
