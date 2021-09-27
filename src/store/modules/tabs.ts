import router from "@/router";
import { setBrowserTitle } from "@/utils/browserTitle";
import { saveCache } from "@/utils/localCache";

import {
  Module,
  VuexModule,
  Action,
  Mutation,
  getModule,
} from "vuex-module-decorators";
import store from "..";

export interface Tab {
  name: string;
  icon?: string;
  path?: string;
  opened?: boolean;
  user_id?: string;
  server_id?: string;
  channel_id?: string;
}

@Module({ dynamic: true, store, namespaced: true, name: "tabs" })
class Tabs extends VuexModule {
  currentTab: Tab = { name: "", icon: "", opened: false };
  tabs: Tab[] = [];

  @Mutation
  private SET_CURRENT_TAB(payload: Tab) {
    this.currentTab = payload;
  }

  @Mutation
  private INIT_TABS(payload: Tab[]) {
    this.tabs = payload;
  }

  @Action
  public initTabs(payload: Tab[]) {
    this.INIT_TABS(payload);
  }
  @Mutation
  private UPDATE_TABS(payload: Tab[]) {
    this.tabs = payload;
  }

  @Action
  public updateTabs(payload: Tab[]) {
    saveCache("tabs", payload);
    this.UPDATE_TABS(payload);
  }

  @Action
  public setCurrentTab(payload: Tab) {
    const obj = { ...payload, path: router.currentRoute.value.path };
    setBrowserTitle(payload.name);
    const tab = this.tabs.find(
      (t) => t.path === router.currentRoute.value.path
    );
    if (tab) {
      this.SET_CURRENT_TAB(obj);
      return;
    }
    this.SET_CURRENT_TAB(obj);
    this.openTab(obj);
    saveCache("tabs", this.tabs);
  }

  @Mutation
  private PUSH_TAB(payload: Tab) {
    this.tabs.push(payload);
  }
  @Mutation
  private REPLACE_TAB(payload: { tab: Tab; index: number }) {
    this.tabs[payload.index] = payload.tab;
  }
  @Action
  openTab(payload: Tab) {
    const existingTabIndex = this.tabs.findIndex(
      (t) => t.path === payload.path
    );
    const existingUnopenedIndex = this.tabs.findIndex((t) => !t.opened);
    if (existingTabIndex >= 0) {
      this.REPLACE_TAB({ tab: payload, index: existingTabIndex });
    } else if (existingUnopenedIndex >= 0) {
      this.REPLACE_TAB({ tab: payload, index: existingUnopenedIndex });
    } else {
      this.PUSH_TAB(payload);
    }
    this.setCurrentTab(payload);
    saveCache("tabs", this.tabs);
  }
  @Action
  closeTabByPath(path: string) {
    if (this.tabs.length === 1) {
      if (router.currentRoute.value.path !== "/app") {
        router.push("/app");
      }
      this.REPLACE_TAB({ index: 0, tab: { ...this.tabs[0], opened: false } });
      saveCache("tabs", this.tabs);
      return;
    }
    const index = this.tabs.findIndex((tab) => tab.path === path);
    const tabBefore = this.tabs?.[index - 1] || this.tabs?.[index + 1];
    if (tabBefore.path && tabBefore.path !== router.currentRoute.value.path) {
      router.push(tabBefore.path);
    }
    this.CLOSE_TAB(index);
    saveCache("tabs", this.tabs);
  }
  @Mutation
  private CLOSE_TAB(index: number) {
    this.tabs.splice(index, 1);
  }
}
export const TabsModule = getModule(Tabs);
