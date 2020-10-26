import {
  Module,
  VuexModule,
  Action,
  Mutation,
  getModule
} from "vuex-module-decorators";
import store from "..";
import Vue from 'vue';

interface PopoutInterface {
  component: string | null; 
  data: any; 
}

@Module({ dynamic: true, store, namespaced: true, name: "popout" })
class Popout extends VuexModule {
  popout: PopoutInterface = {
    component: null,
    data: null
  };

  @Mutation
  private SHOW_POPOUT(payload: {component: string, data: any}) {
    Vue.set(this.popout, "component", payload.component);
    Vue.set(this.popout, "data", payload.data);
  }

  @Action
  public ShowPopout(payload: {component: string, data: any}) {
    this.SHOW_POPOUT(payload);
  }

  @Mutation
  private CLOSE_POPOUT() {
    Vue.set(this.popout, "component", null);
    Vue.set(this.popout, "data", null);
  }

  @Action
  public ClosePopout() {
    this.CLOSE_POPOUT();
  }
}
export const PopoutModule = getModule(Popout);
