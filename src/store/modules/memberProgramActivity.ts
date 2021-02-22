import Vue from "vue";
import {
  Module,
  VuexModule,
  Action,
  Mutation,
  getModule
} from "vuex-module-decorators";
import store from "..";

// programActivity[uniqueid]: {name, status};
interface ProgramActivityObj {
  [key: string]: ProgramActivity;
}
interface ProgramActivity {
  name: string;
  status: string;
}

@Module({ dynamic: true, store, namespaced: true, name: "programActivities" })
class ProgramActivities extends VuexModule {
  programActivity: ProgramActivityObj = {};

  @Mutation
  private INIT_PROGRAM_ACTIVITY(payload: ProgramActivityObj) {
    this.programActivity = payload;
  }

  @Action
  public InitProgramActivity(payload: ProgramActivityObj) {
    this.INIT_PROGRAM_ACTIVITY(payload);
  }
  @Mutation
  private SET_PROGRAM_ACTIVITY(payload: {
    uniqueID: string;
    name: string;
    status: string;
  }) {
    Vue.set(this.programActivity, payload.uniqueID, payload)
  }

  @Action
  public SetProgramActivity(payload: {
    uniqueID: string;
    name: string;
    status: string;
  }) {
    this.SET_PROGRAM_ACTIVITY(payload);
  }
  @Mutation
  private REMOVE_PROGRAM_ACTIVITY(payload: { uniqueID: string }) {
    Vue.delete(this.programActivity, payload.uniqueID);
  }

  @Action
  public RemoveProgramActivity(payload: { uniqueID: string }) {
    this.REMOVE_PROGRAM_ACTIVITY(payload);
  }
}
export const programActivitiesModule = getModule(ProgramActivities);
