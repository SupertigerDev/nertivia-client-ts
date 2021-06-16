import Vue from "vue";
import {
  Module,
  VuexModule,
  Action,
  Mutation,
  getModule
} from "vuex-module-decorators";
import store from "..";

@Module({ dynamic: true, store, namespaced: true, name: "lastSelectedServer" })
class LastSelectedServers extends VuexModule {
  lastSelectedServers = JSON.parse(
    localStorage["lastSelectedServerChannel"] || "{}"
  );

  get lastServerChannelID() {
    return (serverID: string) => {
      return this.lastSelectedServers[serverID];
    };
  }

  @Mutation
  private UPDATE_LAST_SELECTED(payload: {
    serverID: string;
    channelID: string;
  }) {
    Vue.set(this.lastSelectedServers, payload.serverID, payload.channelID);
  }

  @Action
  public UpdateLastSelected(payload: { serverID: string; channelID: string }) {
    this.UPDATE_LAST_SELECTED(payload);
    localStorage["lastSelectedServerChannel"] = JSON.stringify(
      this.lastSelectedServers
    );
  }
}
export const LastSelectedServersModule = getModule(LastSelectedServers);
