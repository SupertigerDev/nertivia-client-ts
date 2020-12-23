import {
  Module,
  VuexModule,
  Action,
  Mutation,
  getModule
} from "vuex-module-decorators";
import store from "..";
import Vue from 'vue';

interface MutedServerObj {
  [key: string]: {
    type: number;
  };
}

@Module({ dynamic: true, store, namespaced: true, name: "mutedServers" })
class MutedServers extends VuexModule {
  mutedServers: MutedServerObj = {};

  get shouldMuteSeverSound() {
    return (channelID: string) => {
      const muted = this.mutedServers[channelID];
      if (!muted) return false;
      return muted.type >= 1;
    };
  }

  @Mutation
  private SET_MUTED_SERVERS(payload: MutedServerObj) {
    this.mutedServers = payload;
  }

  @Action
  public SetMutedServers(payload: MutedServerObj) {
    this.SET_MUTED_SERVERS(payload);
  }

  @Mutation
  private SET_MUTED_SERVER(payload: {serverID: string, type: number}) {
    if (this.mutedServers[payload.serverID]) {
      Vue.set(this.mutedServers[payload.serverID], "type", payload.type)
      return;
    } 
    Vue.set(this.mutedServers, payload.serverID, {type: payload.type})
  }

  @Action
  public SetMutedServer(payload:  {serverID: string, type: number}) {
    this.SET_MUTED_SERVER(payload);
  }
}
export const MutedServersModule = getModule(MutedServers);
