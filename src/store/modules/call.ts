import User from "@/interfaces/User";
import {
  Module,
  VuexModule,
  Action,
  Mutation,
  getModule
} from "vuex-module-decorators";
import store from "..";
import { MeModule } from "./me";

export interface CallParticipant {
  user: User
}

@Module({ dynamic: true, store, namespaced: true, name: "calls" })
class Calls extends VuexModule {
  joinedChannelId: string | null = null;
  joinedUsers =  {};
  get callParticipants() {
    return (channelId: string) => {
      const list: CallParticipant[] = [];
      if (this.joinedChannelId === channelId) {
        list.push({user: MeModule.user as User})
      }
      return list
    }
  }

  @Mutation
  private JOIN_CALL(payload: {channelId: string}) {
    this.joinedChannelId = payload.channelId;
  }

  @Action
  public joinCall(payload: {channelId: string}) {
    this.JOIN_CALL(payload);
  }
}
export const callModule = getModule(Calls);
