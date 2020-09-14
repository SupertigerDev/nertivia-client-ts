import {
  Module,
  VuexModule,
  Action,
  Mutation,
  getModule
} from "vuex-module-decorators";
import store from "..";

@Module({ dynamic: true, store, namespaced: true, name: "scroll" })
class Scroll extends VuexModule {
  isScrolledBottom = true;

  @Mutation
  private SET_SCROLLED_BOTTOM(payload: boolean) {
    this.isScrolledBottom = payload;
  }

  @Action
  public SetScrolledBottom(payload: boolean) {
    this.SET_SCROLLED_BOTTOM(payload);
  }
}
export const ScrollModule = getModule(Scroll);
