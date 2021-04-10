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
  [USER_STATUS_CHANGE](context, data: { id: string; status: number, connected?: boolean; custom_status?: string }) {
    if (data.id === MeModule.user.id) return;
    if (data.status === 0) {
      programActivitiesModule.RemoveProgramActivity({ id: data.id });
      CustomStatusesModule.RemoveCustomStatus({ id: data.id });
    }
    PresencesModule.UpdatePresence({
      presence: data.status,
      id: data.id
    });
    if (data.connected) {
      if (!data.custom_status) {
        CustomStatusesModule.RemoveCustomStatus({id: data.id})
        return;
      }
      CustomStatusesModule.SetCustomStatus({
        custom_status: data.custom_status,
        id: data.id
      });
    }
  },
  [SELF_STATUS_CHANGE](context, data: { status: number }) {
    MeModule.UpdateUser({ status: data.status });
  },
  [CUSTOM_STATUS_CHANGE](
    context,
    data: { custom_status: string; id: string }
  ) {
    CustomStatusesModule.SetCustomStatus({
      custom_status: data.custom_status,
      id: data.id
    });
  },
  [SELF_CUSTOM_STATUS_CHANGE](context, data: { custom_status: string }) {
    if (!MeModule.user.id) return;
    CustomStatusesModule.SetCustomStatus({
      custom_status: data.custom_status,
      id: MeModule.user.id
    });
  },
  [PROGRAM_ACTIVITY_CHANGED](
    context,
    data: { name?: string; status?: string; id: string }
  ) {
    if (!data.name || !data.status) {
      programActivitiesModule.RemoveProgramActivity({
        id: data.id
      });
      return;
    }
    programActivitiesModule.SetProgramActivity({
      id: data.id,
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
  [USER_BLOCKED](context, id) {
    UsersModule.blockUser(id);
  },
  [USER_UNBLOCKED](context, id) {
    UsersModule.unblockUser(id);
  }
};

export default {
  actions
};
