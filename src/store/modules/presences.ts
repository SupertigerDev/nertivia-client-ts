import {
  Module,
  VuexModule,
  Action,
  Mutation,
  getModule
} from "vuex-module-decorators";
import store from "..";
import Vue from "vue";
import { MeModule } from "./me";

interface PresencesObj {
  [key: string]: number;
}

@Module({ dynamic: true, store, namespaced: true, name: "presences" })
class Presences extends VuexModule {
  presences: PresencesObj = {};

  get getPresence() {
    return (uniqueID: string) => {
      const myUniqueID = MeModule.user.uniqueID;
      if (uniqueID === myUniqueID) return MeModule.user.status;
      return this.presences[uniqueID];
    };
  }

  @Mutation
  private INIT_PRESENCES(payload: PresencesObj | any) {
    this.presences = payload;
  }
  @Mutation
  private DELETE_PRESENCE(uniqueID: string) {
    Vue.delete(this.presences, uniqueID);
  }
  @Mutation
  private UPDATE_PRESENCE(payload: { uniqueID: string; presence: number }) {
    Vue.set(this.presences, payload.uniqueID, payload.presence);
  }

  @Action
  public UpdatePresence(payload: { uniqueID: string; presence: number }) {
    if (payload.presence === 0) {
      this.DELETE_PRESENCE(payload.uniqueID);
      return;
    }
    this.UPDATE_PRESENCE(payload);
  }

  @Mutation
  private ADD_PRESENCES(payload: PresencesObj | any) {
    Vue.set(this, "presences", { ...this.presences, ...payload });
  }

  @Action
  public AddPresences(payload: PresencesObj | any) {
    this.ADD_PRESENCES(payload);
  }


  @Action
  public InitPresences(payload: PresencesObj | any) {
    this.INIT_PRESENCES(payload);
  }
}
export const PresencesModule = getModule(Presences);
