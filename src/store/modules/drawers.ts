import {
  Module,
  VuexModule,
  Action,
  Mutation,
  getModule,
} from "vuex-module-decorators";
import store from "..";

@Module({ dynamic: true, store, namespaced: true, name: "drawers" })
class Drawers extends VuexModule {
  leftDrawer = false;
  rightDrawer = false;

  @Mutation
  private SET_LEFT_DRAWER(payload: boolean) {
    this.leftDrawer = payload;
  }

  @Action
  public SetLeftDrawer(payload: boolean) {
    this.SET_LEFT_DRAWER(payload);
  }

  @Mutation
  private SET_RIGHT_DRAWER(payload: boolean) {
    this.rightDrawer = payload;
  }

  @Action
  public SetRightDrawer(payload: boolean) {
    this.SET_RIGHT_DRAWER(payload);
  }
}
export const DrawersModule = getModule(Drawers);
