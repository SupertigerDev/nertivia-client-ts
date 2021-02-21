import {
  Module,
  VuexModule,
  Action,
  Mutation,
  getModule
} from "vuex-module-decorators";
import store from "..";
import Vue from "vue";

// customStatus[uniqueid]: status;
interface CustomStatus {
  [key: string]: string
}

@Module({ dynamic: true, store, namespaced: true, name: "customStatuses" })
class CustomStatuses extends VuexModule {
  customStatus: CustomStatus = {};

  @Mutation
  private INIT_CUSTOM_STATUS(payload: CustomStatus) {
    this.customStatus = payload;
  }

  @Action
  public InitCustomStatus(payload: CustomStatus) {
    this.INIT_CUSTOM_STATUS(payload);
  }
  @Mutation
  private SET_CUSTOM_STATUS(payload: {uniqueID: string; custom_status: string}) {
    this.customStatus[payload.uniqueID] = payload.custom_status;
  }

  @Action
  public SetCustomStatus(payload: {uniqueID: string; custom_status: string}) {
    this.SET_CUSTOM_STATUS(payload);
  }
  @Mutation
  private REMOVE_CUSTOM_STATUS(payload: {uniqueID: string}) {
    Vue.delete(this.customStatus, payload.uniqueID)
  }

  @Action
  public RemoveCustomStatus(payload: {uniqueID: string}) {
    this.REMOVE_CUSTOM_STATUS(payload);
  }

}
export const CustomStatusesModule = getModule(CustomStatuses);
