import {
  Module,
  VuexModule,
  Action,
  Mutation,
  getModule
} from "vuex-module-decorators";
import store from "..";

interface PresencesObj {
  [key: string]: number;
}

@Module({ dynamic: true, store, namespaced: true, name: "preseces" })
class Presences extends VuexModule {
  presences: PresencesObj = {};

  @Mutation
  private INIT_PRESENCES(payload: PresencesObj | any) {
    this.presences = payload;
  }

  @Action
  public InitPresences(payload: PresencesObj | any) {
    this.INIT_PRESENCES(payload);
  }
}
export const PresencesModule = getModule(Presences);
