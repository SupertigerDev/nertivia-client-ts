import User from "@/interfaces/User";
import router from "@/router";
import { getChangelog } from "@/services/updateService";
import { setBrowserTitle } from "@/utils/browserTitle";
import Vue from "vue";
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
  name: string;
  icon?: string;
  path?: string;
  opened?: boolean;
  user_id?: string;
  server_id?: string;
}

@Module({ dynamic: true, store, namespaced: true, name: "tabs" })
class Tabs extends VuexModule {
  currentTab: Tab = { name: "", icon: "", opened: false };
  tabs: Tab[] = [];

  @Mutation
  private SET_CURRENT_TAB(payload: Tab) {
    this.currentTab = payload;
  }

  @Action
  public setCurrentTab(payload: Tab) {
    const obj = { ...payload, path: router.currentRoute.path };
    setBrowserTitle(payload.name);
    const tab = this.tabs.find(t => t.path === router.currentRoute.path);
    if (tab) {
      this.SET_CURRENT_TAB(obj);
      return;
    }
    this.SET_CURRENT_TAB(obj);
    this.openTab(obj);
  }

  @Mutation
  private PUSH_TAB(payload: Tab) {
    this.tabs.push(payload);
  }
  @Mutation
  private REPLACE_TAB(payload: { tab: Tab; index: number }) {
    Vue.set(this.tabs, payload.index, payload.tab);
  }
  @Action
  openTab(payload: Tab) {
    const existingTabIndex = this.tabs.findIndex(t => t.path === payload.path);
    const existingUnopenedIndex = this.tabs.findIndex(t => !t.opened);
    if (existingTabIndex >= 0) {
      this.REPLACE_TAB({ tab: payload, index: existingTabIndex });
    } else if (existingUnopenedIndex >= 0) {
      this.REPLACE_TAB({ tab: payload, index: existingUnopenedIndex });
    } else {
      this.PUSH_TAB(payload);
    }
    this.setCurrentTab(payload);
  }
  @Action
  closeTabByPath(path: string) {
    if (this.tabs.length === 1) {
      if (router.currentRoute.path !== "/app") {
        router.push("/app");
      }
      this.REPLACE_TAB({ index: 0, tab: { ...this.tabs[0], opened: false } });
      return;
    }
    const index = this.tabs.findIndex(tab => tab.path === path);
    const tabBefore = this.tabs?.[index - 1] || this.tabs?.[index + 1];
    if (tabBefore.path && tabBefore.path !== router.currentRoute.path) {
      router.push(tabBefore.path);
    }
    this.CLOSE_TAB(index);
  }
  @Mutation
  private CLOSE_TAB(index: number) {
    Vue.delete(this.tabs, index);
  }
}
export const TabsModule = getModule(Tabs);
