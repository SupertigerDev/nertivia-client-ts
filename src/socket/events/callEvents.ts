import { MeModule } from "@/store/modules/me";
import { voiceChannelModule } from "@/store/modules/voiceChannels";
import { addPeer, createPeer } from "@/utils/peer";
import Peer from "simple-peer";

export const onJoin = (data: { channelId: string; userId: string }) => {
  const channelData: any = data;
  if (voiceChannelModule.joinedchannelId === data.channelId) {
    if (data.userId === MeModule.user.id) return;
    channelData.peer = createPeer(
      data.channelId,
      data.userId,
      voiceChannelModule.myStreamsArray
    );
  }

  voiceChannelModule.addUser({
    channelId: data.channelId,
    userId: data.userId,
    data: channelData,
  });
};
export const onLeave = (data: { channelId: string; userId: string }) => {
  if (
    voiceChannelModule.joinedchannelId === data.channelId &&
    data.userId === MeModule.user.id
  ) {
    voiceChannelModule.leave();
    return;
  }
  voiceChannelModule.removeUser(data);
};
export const onReceiveSignal = (data: {
  channelId: string;
  requesterId: string;
  signal: Peer.SignalData;
}) => {
  const voiceChanel =
    voiceChannelModule.voiceChannelUsers[data.channelId]?.[data.requesterId];
  if (voiceChanel?.peer) {
    voiceChanel.peer.signal(data.signal);
    return;
  }
  const peer = addPeer(
    data.channelId,
    data.requesterId,
    data.signal,
    voiceChannelModule.myStreamsArray
  );
  voiceChannelModule.update({
    channelId: data.channelId,
    userId: data.requesterId,
    update: { peer },
  });
};
export const onReceiveReturnSignal = (data: {
  channelId: string;
  requesterId: string;
  signal: Peer.SignalData;
}) => {
  voiceChannelModule.voiceChannelUsers[data.channelId]?.[
    data.requesterId
  ]?.peer?.signal(data.signal);
};
