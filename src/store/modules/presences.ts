import {
  Module,
  VuexModule,
  Action,
  Mutation,
  getModule,
} from "vuex-module-decorators";
import store from "..";

import { MeModule } from "./me";

interface PresencesObj {
  [key: string]: number;
}

@Module({ dynamic: true, store, namespaced: true, name: "presences" })
class Presences extends VuexModule {
  presences: PresencesObj = {};

  get getPresence() {
    return (id: string) => {
      const myUserID = MeModule.user.id;
      if (id === myUserID) return MeModule.user.status;
      return this.presences[id];
    };
  }

  @Mutation
  private INIT_PRESENCES(payload: PresencesObj | any) {
    this.presences = payload;
  }
  @Mutation
  private DELETE_PRESENCE(id: string) {
    delete this.presences[id];
  }
  @Mutation
  private UPDATE_PRESENCE(payload: { id: string; presence: number }) {
    this.presences[payload.id] = payload.presence;
  }

  @Action
  public UpdatePresence(payload: { id: string; presence: number }) {
    if (payload.presence === 0) {
      this.DELETE_PRESENCE(payload.id);
      return;
    }
    this.UPDATE_PRESENCE(payload);
  }

  @Mutation
  private ADD_PRESENCES(payload: PresencesObj | any) {
    this.presences = { ...this.presences, ...payload };
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
