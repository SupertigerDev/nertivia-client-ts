import {
  CUSTOM_STATUS_CHANGE,
  PROGRAM_ACTIVITY_CHANGED,
  SELF_CUSTOM_STATUS_CHANGE,
  SELF_STATUS_CHANGE,
  USER_STATUS_CHANGE,
  GOOGLE_DRIVE_LINKED,
  USER_BLOCKED,
  USER_UNBLOCKED,
  USER_JOINED_CALL
} from "@/socketEventConstants";
import { ActionTree } from "vuex";
import { voiceChannelModule } from "../voiceChannels";
import { MeModule } from "../me";
import { CustomStatusesModule } from "../memberCustomStatus";
import { programActivitiesModule } from "../memberProgramActivity";
import { PresencesModule } from "../presences";
import { UsersModule } from "../users";

const actions: ActionTree<any, any> = {
  [USER_STATUS_CHANGE](
    context,
    data: {
      user_id: string;
      status: number;
      connected?: boolean;
      custom_status?: string;
    }
  ) {
    if (data.user_id === MeModule.user.id) return;
    if (data.status === 0) {
      programActivitiesModule.RemoveProgramActivity({ id: data.user_id });
      CustomStatusesModule.RemoveCustomStatus({ id: data.user_id });
    }
    PresencesModule.UpdatePresence({
      presence: data.status,
      id: data.user_id
    });
    if (data.connected) {
      if (!data.custom_status) {
        CustomStatusesModule.RemoveCustomStatus({ id: data.user_id });
        return;
      }
      CustomStatusesModule.SetCustomStatus({
        custom_status: data.custom_status,
        id: data.user_id
      });
    }
  },
  [SELF_STATUS_CHANGE](context, data: { status: number }) {
    MeModule.UpdateUser({ status: data.status });
  },
  [USER_JOINED_CALL](context, data: { channelId: string, userId: string}) {
    if (voiceChannelModule.joinedChannelId && data.userId === MeModule.user.id) return;
    voiceChannelModule.addUser(data)
  },
  [CUSTOM_STATUS_CHANGE](
    context,
    data: { custom_status: string; user_id: string }
  ) {
    CustomStatusesModule.SetCustomStatus({
      custom_status: data.custom_status,
      id: data.user_id
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
    data: { name?: string; status?: string; user_id: string }
  ) {
    if (!data.name || !data.status) {
      programActivitiesModule.RemoveProgramActivity({
        id: data.user_id
      });
      return;
    }
    programActivitiesModule.SetProgramActivity({
      id: data.user_id,
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
