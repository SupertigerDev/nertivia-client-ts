import {
  CUSTOM_STATUS_CHANGE,
  PROGRAM_ACTIVITY_CHANGED,
  SELF_CUSTOM_STATUS_CHANGE,
  SELF_STATUS_CHANGE,
  USER_STATUS_CHANGE,
  GOOGLE_DRIVE_LINKED,
  USER_BLOCKED,
  USER_UNBLOCKED
} from "@/socketEventConstants";
import { ActionTree } from "vuex";
import { MeModule } from "../me";
import { CustomStatusesModule } from "../memberCustomStatus";
import { programActivitiesModule } from "../memberProgramActivity";
import { PresencesModule } from "../presences";
import { UsersModule } from "../users";

const actions: ActionTree<any, any> = {
  [USER_STATUS_CHANGE](context, data: { uniqueID: string; status: number, connected?: boolean; custom_status?: string }) {
    if (data.uniqueID === MeModule.user.uniqueID) return;
    if (data.status === 0) {
      programActivitiesModule.RemoveProgramActivity({ uniqueID: data.uniqueID });
      CustomStatusesModule.RemoveCustomStatus({ uniqueID: data.uniqueID });
    }
    PresencesModule.UpdatePresence({
      presence: data.status,
      uniqueID: data.uniqueID
    });
    if (data.connected) {
      if (!data.custom_status) {
        CustomStatusesModule.RemoveCustomStatus({uniqueID: data.uniqueID})
        return;
      }
      CustomStatusesModule.SetCustomStatus({
        custom_status: data.custom_status,
        uniqueID: data.uniqueID
      });
    }
  },
  [SELF_STATUS_CHANGE](context, data: { status: number }) {
    MeModule.UpdateUser({ status: data.status });
  },
  [CUSTOM_STATUS_CHANGE](
    context,
    data: { custom_status: string; uniqueID: string }
  ) {
    console.log(data)
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
  },
  [PROGRAM_ACTIVITY_CHANGED](
    context,
    data: { name?: string; status?: string; uniqueID: string }
  ) {
    if (!data.name || !data.status) {
      programActivitiesModule.RemoveProgramActivity({
        uniqueID: data.uniqueID
      });
      return;
    }
    programActivitiesModule.SetProgramActivity({
      uniqueID: data.uniqueID,
      name: data.name,
      status: data.status
    });
  },
  [GOOGLE_DRIVE_LINKED]() {
    MeModule.UpdateUser({ googleDriveLinked: true });
  },
  [GOOGLE_DRIVE_LINKED]() {
    MeModule.UpdateUser({ googleDriveLinked: true });
  },
  [USER_BLOCKED](context, uniqueID) {
    UsersModule.blockUser(uniqueID);
  },
  [USER_UNBLOCKED](context, uniqueID) {
    UsersModule.unblockUser(uniqueID);
  }
};

export default {
  actions
};
