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
class Calls extends VuexModule {
  joinedChannelId: string | null = null;
  // joinedChannelUsers[channelId][userId]
  joinedChannelUsers: {[key: string]: {[key: string]: CallParticipant}} = {};
  get callParticipants() {
    return (channelId: string) => {
      const list: (CallParticipant & {user: User})[] = [];
      if (this.joinedChannelId === channelId) {
        list.push({user: MeModule.user as User})
      }
      const channelCalls = this.joinedChannelUsers[channelId];
      if (!channelCalls) return list;
      for (const userId in channelCalls) {
        list.push({...channelCalls[userId], user: UsersModule.users[userId]}) 
      }
      return list
    }
  }

  @Mutation
  private JOIN_CALL(payload: {channelId: string}) {
    this.joinedChannelId = payload.channelId;
  }

  @Action
  public joinCall(payload: {channelId: string}) {
    this.JOIN_CALL(payload);
  }

  @Mutation
  private INIT_CALLS(payload: {[key: string]: {[key: string]: CallParticipant}}) {
    this.joinedChannelUsers = payload;
  }

  @Action
  public InitCalls(payload: {[key: string]: {[key: string]: CallParticipant}}) {
    this.INIT_CALLS(payload);
  }
  @Mutation
  private ADD_USER(payload: {userId: string, channelId: string}) {
    const users = this.joinedChannelUsers[payload.channelId];
    if (!users) {
      Vue.set(this.joinedChannelUsers, payload.channelId, {[payload.userId]: {}})
      return;
    }
    Vue.set(this.joinedChannelUsers[payload.channelId],payload.userId, {})
  }

  @Action
  public addUser(payload: {userId: string, channelId: string}) {
    this.ADD_USER(payload);
  }
}
export const callModule = getModule(Calls);
