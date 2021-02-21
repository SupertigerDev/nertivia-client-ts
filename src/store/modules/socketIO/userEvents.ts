import {
  CUSTOM_STATUS_CHANGE,
  SELF_CUSTOM_STATUS_CHANGE,
  SELF_STATUS_CHANGE,
  USER_STATUS_CHANGE
} from "@/socketEventConstants";
import { ActionTree } from "vuex";
import { MeModule } from "../me";
import { CustomStatusesModule } from "../memberCustomStatus";
import { programActivitiesModule } from "../memberProgramActivity";
import { PresencesModule } from "../presences";

const actions: ActionTree<any, any> = {
  [USER_STATUS_CHANGE](context, data: { uniqueID: string; status: number }) {
    if (data.uniqueID === MeModule.user.uniqueID) return;
    programActivitiesModule.RemoveProgramActivity({ uniqueID: data.uniqueID });
    CustomStatusesModule.RemoveCustomStatus({ uniqueID: data.uniqueID });
    PresencesModule.UpdatePresence({
      presence: data.status,
      uniqueID: data.uniqueID
    });
  },
  [SELF_STATUS_CHANGE](context, data: { status: number }) {
    MeModule.UpdateUser({ status: data.status });
  },
  [CUSTOM_STATUS_CHANGE](
    context,
    data: { custom_status: string; uniqueID: string }
  ) {
    CustomStatusesModule.SetCustomStatus({
      custom_status: data.custom_status,
      uniqueID: data.uniqueID
    });
  },
  [SELF_CUSTOM_STATUS_CHANGE](context, data: { custom_status: string }) {
    if (!MeModule.user.uniqueID) return;
    CustomStatusesModule.SetCustomStatus({
      custom_status: data.custom_status,
      uniqueID: MeModule.user.uniqueID
    });
  }
};
export default {
  actions
};
