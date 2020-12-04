import {
  Module,
  VuexModule,
  Action,
  Mutation,
  getModule
} from "vuex-module-decorators";
import store from "..";

interface MutedServerObj {
  [key: string]: {
    type: number
  }
}

@Module({ dynamic: true, store, namespaced: true, name: "mutedServers" })
class MutedServers extends VuexModule {
  mutedServers: MutedServerObj = {};

  get shouldMuteSeverSound() {
    return (channelID: string) => {
      const muted = this.mutedServers[channelID];
      if (!muted) return false;
      return muted.type >= 1
    }
  }

  @Mutation
  private SET_MUTED_SERVERS(payload: MutedServerObj) {
    this.mutedServers = payload;
  }

  @Action
  public SetMutedServers(payload: MutedServerObj) {
    this.SET_MUTED_SERVERS(payload);
  }

}
export const MutedServersModule = getModule(MutedServers);
