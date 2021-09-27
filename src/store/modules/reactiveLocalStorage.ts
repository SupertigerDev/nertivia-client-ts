import {
  Module,
  VuexModule,
  Action,
  Mutation,
  getModule,
} from "vuex-module-decorators";
import store from "..";

interface Store {
  showSettingsInNavigation: boolean;
}

@Module({
  dynamic: true,
  store,
  namespaced: true,
  name: "reactiveLocalStorage",
})
class ReactiveLocalStorage extends VuexModule {
  localStore: Store = {
    showSettingsInNavigation:
      localStorage["showSettingsInNavigation"] === "true",
  };

  get getStore() {
    return <K extends keyof Store>(key: K) => {
      return this.localStore[key];
    };
  }

  @Action
  setStore<K extends keyof Store>({ key, value }: { key: K; value: Store[K] }) {
    localStorage[key] = JSON.stringify(value);
    this.SET_STORE({ key, value });
  }

  @Mutation
  private SET_STORE<K extends keyof Store>({
    key,
    value,
  }: {
    key: K;
    value: Store[K];
  }) {
    this.localStore[key] = value;
  }
}
export const ReactiveLocalStorageModule = getModule(ReactiveLocalStorage);
