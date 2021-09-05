import {
  CUSTOM_STATUS_CHANGE,
  PROGRAM_ACTIVITY_CHANGED,
  SELF_CUSTOM_STATUS_CHANGE,
  SELF_STATUS_CHANGE,
  USER_STATUS_CHANGE,
  GOOGLE_DRIVE_LINKED,
  USER_BLOCKED,
  USER_UNBLOCKED,
  USER_JOINED_CALL,
  USER_LEFT_CALL,
  VOICE_RECEIVE_SIGNAL,
  VOICE_RECEIVE_RETURN_SIGNAL
} from "@/socketEventConstants";
import Peer from 'simple-peer';
import { ActionTree } from "vuex";
import { voiceChannelModule } from "../voiceChannels";
import { MeModule } from "../me";
import { CustomStatusesModule } from "../memberCustomStatus";
import { programActivitiesModule } from "../memberProgramActivity";
import { PresencesModule } from "../presences";
import { UsersModule } from "../users";
import { addPeer, createPeer } from "@/utils/peer";

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
  [USER_JOINED_CALL](context, data: { channelId: string, userId: string }) {
    const channelData: any = data;
    if (voiceChannelModule.joinedChannelId === data.channelId) {
      if (data.userId === MeModule.user.id) return;
      channelData.peer = createPeer(data.channelId, data.userId)
    };

    voiceChannelModule.addUser({ channelId: data.channelId, userId: data.userId, data: channelData })
  },
  [USER_LEFT_CALL](context, data: { channelId: string, userId: string }) {
    if (voiceChannelModule.joinedChannelId === data.channelId && data.userId === MeModule.user.id) {
      voiceChannelModule.leave();
      return;
    };
    voiceChannelModule.removeUser(data)
  },
  [VOICE_RECEIVE_SIGNAL](context, data: { channelId: string, requesterId: string, signal: Peer.SignalData }) {
    const peer = addPeer(data.channelId, data.requesterId, data.signal);
    voiceChannelModule.update({
      channelId: data.channelId,
      userId: data.requesterId,
      update: { peer }
    })
  },
  [VOICE_RECEIVE_RETURN_SIGNAL](context, data: { channelId: string, requesterId: string, signal: Peer.SignalData }) {
    voiceChannelModule.voiceChannelUsers[data.channelId]?.[data.requesterId]?.peer?.signal(data.signal);
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
