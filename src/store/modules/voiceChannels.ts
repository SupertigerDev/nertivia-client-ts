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

export interface CallParticipant {
  peer?: any,


}

@Module({ dynamic: true, store, namespaced: true, name: "calls" })
class VoiceChannels extends VuexModule {
  joinedChannelId: string | null = null;
  // voiceChannelUsers[channelId][userId]
  voiceChannelUsers: {[key: string]: {[key: string]: CallParticipant}} = {};
  
  get callParticipants() {
    return (channelId: string) => {
      const list: (CallParticipant & {user: User})[] = [];
      if (this.joinedChannelId === channelId) {
        list.push({user: MeModule.user as User})
      }
      const channelCalls = this.voiceChannelUsers[channelId];
      if (!channelCalls) return list;
      for (const userId in channelCalls) {
        list.push({...channelCalls[userId], user: UsersModule.users[userId]}) 
      }
      return list
    }
  }

  @Mutation
  private JOIN(payload: {channelId: string}) {
    this.joinedChannelId = payload.channelId;
  }

  @Action
  public join(payload: {channelId: string}) {
    this.JOIN(payload);
  }

  @Mutation
  private INIT_VOICE_CHANNELS(payload: {[key: string]: {[key: string]: CallParticipant}}) {
    this.voiceChannelUsers = payload;
  }

  @Action
  public InitVoiceChannels(payload: {[key: string]: {[key: string]: CallParticipant}}) {
    this.INIT_VOICE_CHANNELS(payload);
  }
  @Mutation
  private ADD_USER(payload: {userId: string, channelId: string}) {
    const users = this.voiceChannelUsers[payload.channelId];
    if (!users) {
      Vue.set(this.voiceChannelUsers, payload.channelId, {[payload.userId]: {}})
      return;
    }
    Vue.set(this.voiceChannelUsers[payload.channelId],payload.userId, {})
  }

  @Action
  public addUser(payload: {userId: string, channelId: string}) {
    this.ADD_USER(payload);
  }
}
export const voiceChannelModule = getModule(VoiceChannels);
