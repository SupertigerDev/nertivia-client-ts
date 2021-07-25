import { getChangelog } from "@/services/updateService";
import { setBrowserTitle } from "@/utils/browserTitle";
import {
  Module,
  VuexModule,
  Action,
  Mutation,
  getModule
} from "vuex-module-decorators";
import store from "..";

const CHECK_AFTER = 600000; // 60 minutes
const CURRENT_VERSION = process.env.VUE_APP_VERSION;

export interface Tab {
  name: string,
  icon?: string
}

@Module({ dynamic: true, store, namespaced: true, name: "tabs" })
class Tabs extends VuexModule {
    currentTab: Tab = {name: "", icon: ""}

  @Mutation
  private SET_CURRENT_TAB(payload: {name: string, icon?: string}) {
    this.currentTab = payload;
  }

  @Action
  public setCurrentTab(payload: {name: string, icon?: string}) {
      setBrowserTitle(payload.name);
      this.SET_CURRENT_TAB(payload);
  }
}
export const TabsModule = getModule(Tabs);
