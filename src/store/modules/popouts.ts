import {
  Module,
  VuexModule,
  Action,
  Mutation,
  getModule,
} from "vuex-module-decorators";
import store from "..";

interface PopoutInterface {
  id: string;
  key?: string;
  component: string;
  data?: any;
}
interface PopoutObj {
  [key: string]: PopoutInterface;
}

@Module({ dynamic: true, store, namespaced: true, name: "popouts" })
class Popouts extends VuexModule {
  popouts: PopoutObj = {};

  get isOpened() {
    return (id: string) => this.popouts[id];
  }

  @Mutation
  private SHOW_POPOUT(payload: {
    id: string;
    component: string;
    data?: any;
    key?: string;
  }) {
    this.popouts[payload.id] = {
      id: payload.id,
      component: payload.component,
      data: payload.data,
      key: payload.key,
    };
  }

  @Action
  public ShowPopout(payload: {
    id: string;
    component: string;
    data?: any;
    key?: string;
    toggle?: boolean;
  }) {
    if (payload.toggle && this.isOpened(payload.id)) {
      this.ClosePopout(payload.id);
      return;
    }
    this.SHOW_POPOUT(payload);
  }

  @Mutation
  private CLOSE_POPOUT(id: string) {
    delete this.popouts[id];
  }

  @Action
  public ClosePopout(id: string) {
    this.CLOSE_POPOUT(id);
  }
}
export const PopoutsModule = getModule(Popouts);
