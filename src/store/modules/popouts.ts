import {
  Module,
  VuexModule,
  Action,
  Mutation,
  getModule
} from "vuex-module-decorators";
import store from "..";
import Vue from "vue";

interface PopoutInterface {
  id: string;
  component: string;
  data: any;
}
interface PopoutObj {
  [key: string]: PopoutInterface;
}

@Module({ dynamic: true, store, namespaced: true, name: "popouts" })
class Popouts extends VuexModule {
  popouts: PopoutObj = {};

  @Mutation
  private SHOW_POPOUT(payload: { id: string, component: string; data: any }) {
    Vue.set(this.popouts, payload.id, {component: payload.component, data: payload.data});
  }

  @Action
  public ShowPopout(payload: { id: string, component: string; data: any }) {
    this.SHOW_POPOUT(payload);
  }

  @Mutation
  private CLOSE_POPOUT(id: string) {
    Vue.delete(this.popouts, id);
  }

  @Action
  public ClosePopout(id: string) {
    this.CLOSE_POPOUT(id);
  }
}
export const PopoutsModule = getModule(Popouts);
