import User from "@/interfaces/User";

import {
  Module,
  VuexModule,
  Action,
  Mutation,
  getModule,
} from "vuex-module-decorators";
import store from "..";
import { MeModule } from "./me";
import { UsersModule } from "./users";

import Peer from "simple-peer";
import { ChannelsModule } from "./channels";

export interface CallParticipant {
  peer?: Peer.Instance;
  connected?: boolean;
  videoStream?: MediaStream | null;
  audioStream?: MediaStream | null;
}

@Module({ dynamic: true, store, namespaced: true, name: "calls" })
class VoiceChannels extends VuexModule {
  joinedChannelId: string | null = null;
  audioStream: MediaStream | null = null;
  videoStream: MediaStream | null = null;
  // voiceChannelUsers[channelId][userId]
  voiceChannelUsers: { [key: string]: { [key: string]: CallParticipant } } = {};

  get callParticipants() {
    return (channelId: string) => {
      const list: (CallParticipant & { user: User })[] = [];
      if (this.joinedChannelId === channelId) {
        list.push({ user: MeModule.user as User });
      }
      const channelCalls = this.voiceChannelUsers[channelId];
      if (!channelCalls) return list;
      for (const userId in channelCalls) {
        list.push({ ...channelCalls[userId], user: UsersModule.users[userId] });
      }
      return list;
    };
  }
  get myStreamsArray() {
    const arr: Array<MediaStream> = [];
    if (this.audioStream) {
      arr.push(this.audioStream);
    }
    if (this.videoStream) {
      arr.push(this.videoStream);
    }
    return arr;
  }

  @Mutation
  private JOIN(payload: { channelId: string }) {
    this.joinedChannelId = payload.channelId;
  }

  @Action
  public join(payload: { channelId: string }) {
    this.JOIN(payload);
  }
  @Mutation
  private LEAVE() {
    this.joinedChannelId = null;
    const tracks = (this.videoStream?.getTracks() || []).concat(
      this.audioStream?.getTracks() || []
    );
    tracks.forEach((t) => t.stop());
    this.videoStream = null;
    this.audioStream = null;
  }

  @Action
  public leave() {
    const voiceChannelUsers =
      this.voiceChannelUsers[this.joinedChannelId as string];
    if (voiceChannelUsers) {
      for (const userId in voiceChannelUsers) {
        const vc = voiceChannelUsers[userId];
        vc.peer?.end();
        vc.peer?.destroy();
        this.update({
          channelId: this.joinedChannelId as string,
          userId,
          update: { peer: undefined },
        });
      }
    }
    this.LEAVE();
  }

  @Mutation
  private INIT_VOICE_CHANNELS(payload: {
    [key: string]: { [key: string]: CallParticipant };
  }) {
    this.voiceChannelUsers = payload;
  }

  @Action
  public InitVoiceChannels(payload: {
    [key: string]: { [key: string]: CallParticipant };
  }) {
    this.INIT_VOICE_CHANNELS(payload);
  }

  @Mutation
  private ADD_VOICE_CHANNELS(payload: {
    [key: string]: { [key: string]: CallParticipant };
  }) {
    this.voiceChannelUsers = {
      ...this.voiceChannelUsers,
      ...payload,
    };
  }

  @Action
  public AddVoiceChannels(payload: {
    [key: string]: { [key: string]: CallParticipant };
  }) {
    this.ADD_VOICE_CHANNELS(payload);
  }
  @Mutation
  private ADD_USER(payload: {
    userId: string;
    channelId: string;
    data: CallParticipant;
  }) {
    const users = this.voiceChannelUsers[payload.channelId];
    if (!users) {
      this.voiceChannelUsers[payload.channelId] = {
        [payload.userId]: payload.data,
      };
      return;
    }

    this.voiceChannelUsers[payload.channelId][payload.userId] = payload.data;
  }
  @Action
  public removeServerUser(payload: { userId: string; serverId: string }) {
    const serverChannels = ChannelsModule.serverChannels(payload.serverId);
    for (let i = 0; i < serverChannels.length; i++) {
      const channel = serverChannels[i];
      if (!this.voiceChannelUsers[channel.channelId]) continue;
      this.removeUser({ channelId: channel.channelId, userId: payload.userId });
    }
  }
  @Action
  public deleteServerVoiceChannels(serverId: string) {
    const serverChannels = ChannelsModule.serverChannels(serverId);
    for (let i = 0; i < serverChannels.length; i++) {
      const channel = serverChannels[i];
      this.removeChannel(channel.channelId);
    }
  }
  @Mutation
  private REMOVE_CHANNEL(channelId: string) {
    delete this.voiceChannelUsers[channelId];
  }
  @Action
  public removeChannel(channelId: string) {
    if (channelId === this.joinedChannelId) {
      this.leave();
    }
    const voiceChannel = this.voiceChannelUsers[channelId];
    if (!voiceChannel) return;
    Object.values(voiceChannel).forEach((vc) => {
      vc.peer?.destroy();
    });
    this.REMOVE_CHANNEL(channelId);
  }

  @Action
  public addUser(payload: {
    userId: string;
    channelId: string;
    data: CallParticipant;
  }) {
    this.ADD_USER(payload);
  }
  @Mutation
  private REMOVE_USER(payload: { userId: string; channelId: string }) {
    const users = this.voiceChannelUsers[payload.channelId];
    if (!users) {
      return;
    }
    delete this.voiceChannelUsers[payload.channelId][payload.userId];
  }

  @Action
  public removeUser(payload: { userId: string; channelId: string }) {
    this.voiceChannelUsers[payload.channelId]?.[
      payload.userId
    ]?.peer?.destroy();
    this.REMOVE_USER(payload);
  }

  @Mutation
  private UPDATE(payload: {
    channelId: string;
    userId: string;
    update: Partial<CallParticipant>;
  }) {
    const old = this.voiceChannelUsers[payload.channelId]?.[payload.userId];
    if (!old) return;
    this.voiceChannelUsers[payload.channelId][payload.userId] = {
      ...old,
      ...payload.update,
    };
  }

  @Action
  public update(payload: {
    channelId: string;
    userId: string;
    update: Partial<CallParticipant>;
  }) {
    this.UPDATE(payload);
  }

  @Mutation
  private UPDATE_LOCAL_STREAM(payload: {
    type: "audio" | "video";
    stream: MediaStream | null;
  }) {
    if (payload.type === "audio") {
      this.audioStream = payload.stream;
    } else {
      this.videoStream = payload.stream;
    }
  }

  @Action
  public removeVideoStream() {
    const videoStream = this.videoStream;
    if (!videoStream) return;
    const voiceChannelPeers = Object.values(
      this.voiceChannelUsers[this.joinedChannelId || ""] || {}
    );
    videoStream.getTracks().forEach((track) => track.stop());
    voiceChannelPeers.forEach((p) => {
      p.peer?.removeStream(videoStream);
    });
    this.UPDATE_LOCAL_STREAM({ type: "video", stream: null });
  }
  @Action
  public addStream(payload: { stream: MediaStream; type: "audio" | "video" }) {
    const oldStream =
      payload.type === "audio" ? this.audioStream : this.videoStream;
    oldStream?.getTracks().forEach((track) => track.stop());

    const videoTracks = payload?.stream?.getVideoTracks();

    if (videoTracks[0]) {
      videoTracks[0].onended = () => {
        const voiceChannelPeers = Object.values(
          this.voiceChannelUsers[this.joinedChannelId || ""] || {}
        );
        voiceChannelPeers.forEach((p) => {
          p.peer?.removeStream(payload.stream);
        });
        videoTracks[0].onended = null;
        this.UPDATE_LOCAL_STREAM({ type: "video", stream: null });
      };
    }

    const voiceChannelPeers = Object.values(
      this.voiceChannelUsers[this.joinedChannelId || ""] || {}
    );
    if (!voiceChannelPeers.length) {
      this.UPDATE_LOCAL_STREAM(payload);
      return;
    }
    // stream to all peers
    voiceChannelPeers.forEach((p) => {
      if (oldStream) {
        p.peer?.removeStream(oldStream);
      }
      p.peer?.addStream(payload.stream);
    });
    this.UPDATE_LOCAL_STREAM(payload);
  }
  @Action
  public removeAudioStream() {
    if (!this.audioStream) return;
    const voiceChannelPeers = Object.values(
      this.voiceChannelUsers[this.joinedChannelId || ""] || {}
    );
    this.audioStream.getTracks().forEach((track) => track.stop());
    voiceChannelPeers.forEach((p) => {
      if (!this.audioStream) return;
      p.peer?.removeStream(this.audioStream);
    });
    this.REMOVE_AUDIO_STREAM();
  }
  @Mutation
  private REMOVE_AUDIO_STREAM() {
    this.audioStream = null;
  }
  @Action
  public toggleMic() {
    if (this.audioStream) {
      this.removeAudioStream();
      return;
    }
    const constaints: any = { audio: true };

    if (localStorage["inputDeviceId"]) {
      constaints.deviceId = {
        exact: localStorage["inputDeviceId"],
      };
    }
    navigator.mediaDevices.getUserMedia(constaints).then((stream) => {
      this.addStream({ type: "audio", stream });
    });
  }
}

export const voiceChannelModule = getModule(VoiceChannels);
