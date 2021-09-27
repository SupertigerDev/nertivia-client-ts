import {
  Module,
  VuexModule,
  Action,
  Mutation,
  getModule,
} from "vuex-module-decorators";
import store from "..";

interface MutedServerObj {
  [key: string]: {
    type: number;
  };
}

@Module({ dynamic: true, store, namespaced: true, name: "mutedServers" })
class MutedServers extends VuexModule {
  mutedServers: MutedServerObj = {};

  get serverSoundMuted() {
    return (serverID: string) => {
      const muted = this.mutedServers[serverID];
      if (!muted) return false;
      return muted.type >= 1;
    };
  }

  get shouldMuteServerNotification() {
    return (serverID: string) => {
      const muted = this.mutedServers[serverID];
      if (!muted) return false;
      return muted.type === 2;
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
  private SET_MUTED_SERVER(payload: { serverID: string; type: number }) {
    if (this.mutedServers[payload.serverID]) {
      this.mutedServers[payload.serverID].type = payload.type;
      return;
    }
    this.mutedServers[payload.serverID] = { type: payload.type };
  }

  @Action
  public SetMutedServer(payload: { serverID: string; type: number }) {
    this.SET_MUTED_SERVER(payload);
  }
}
export const MutedServersModule = getModule(MutedServers);
