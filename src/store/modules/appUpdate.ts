import { getChangelog } from "@/services/updateService";
import {
  Module,
  VuexModule,
  Action,
  Mutation,
  getModule,
} from "vuex-module-decorators";
import store from "..";

const CHECK_AFTER = 600000; // 60 minutes
const CURRENT_VERSION = process.env.VUE_APP_VERSION;

@Module({ dynamic: true, store, namespaced: true, name: "appUpdate" })
class AppUpdate extends VuexModule {
  lastCheck = Date.now();
  updateAvailable = false;

  @Mutation
  private SET_UPADTE_AVAILABLE(payload: boolean) {
    this.updateAvailable = payload;
  }
  @Mutation
  private UPDATE_LAST_CHECK() {
    this.lastCheck = Date.now();
  }

  @Action
  public check(options?: { force: boolean }) {
    if (this.updateAvailable) return;
    if (!options?.force && Date.now() - this.lastCheck <= CHECK_AFTER) return;
    this.UPDATE_LAST_CHECK();
    getChangelog().then((log) => {
      const version = log[0].version;
      this.SET_UPADTE_AVAILABLE(CURRENT_VERSION !== version);
    });
  }
}
export const AppUpdateModule = getModule(AppUpdate);
