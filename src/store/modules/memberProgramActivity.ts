import {
  Module,
  VuexModule,
  Action,
  Mutation,
  getModule,
} from "vuex-module-decorators";
import store from "..";

// programActivity[user_id]: {name, status};
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
    id: string;
    name: string;
    status: string;
  }) {
    this.programActivity[payload.id] = payload;
  }

  @Action
  public SetProgramActivity(payload: {
    id: string;
    name: string;
    status: string;
  }) {
    this.SET_PROGRAM_ACTIVITY(payload);
  }
  @Mutation
  private REMOVE_PROGRAM_ACTIVITY(payload: { id: string }) {
    delete this.programActivity[payload.id];
  }

  @Action
  public RemoveProgramActivity(payload: { id: string }) {
    this.REMOVE_PROGRAM_ACTIVITY(payload);
  }
  @Mutation
  private ADD_ACTIVITIES(payload: ProgramActivityObj | any) {
    this.programActivity = { ...this.programActivity, ...payload };
  }

  @Action
  public AddActivities(payload: ProgramActivityObj | any) {
    this.ADD_ACTIVITIES(payload);
  }
}
export const programActivitiesModule = getModule(ProgramActivities);
