import User from "@/interfaces/User";
import Vue from "vue";
import {
  Module,
  VuexModule,
  Action,
  Mutation,
  getModule
} from "vuex-module-decorators";
import store from "..";
import { MeModule } from "./me";
import { UsersModule } from "./users";

import Peer from "simple-peer";

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
  }

  @Action
  public leave() {
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
  private ADD_USER(payload: {
    userId: string;
    channelId: string;
    data: CallParticipant;
  }) {
    const users = this.voiceChannelUsers[payload.channelId];
    if (!users) {
      Vue.set(this.voiceChannelUsers, payload.channelId, {
        [payload.userId]: payload.data
      });
      return;
    }
    Vue.set(
      this.voiceChannelUsers[payload.channelId],
      payload.userId,
      payload.data
    );
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
    Vue.delete(this.voiceChannelUsers[payload.channelId], payload.userId);
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
    Vue.set(this.voiceChannelUsers[payload.channelId], payload.userId, {
      ...old,
      ...payload.update
    });
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
  public addStream(payload: { stream: MediaStream; type: "audio" | "video" }) {
    // stream to all peers
    const voiceChannelPeers = this.voiceChannelUsers[
      this.joinedChannelId || ""
    ];
    if (!voiceChannelPeers) return;
    const oldStream =
      payload.type === "audio" ? this.audioStream : this.videoStream;
    Object.values(voiceChannelPeers).forEach(p => {
      if (oldStream) {
        p.peer?.removeStream(oldStream);
      }
      p.peer?.addStream(payload.stream);
    });
    this.UPDATE_LOCAL_STREAM(payload);
  }
}
export const voiceChannelModule = getModule(VoiceChannels);
