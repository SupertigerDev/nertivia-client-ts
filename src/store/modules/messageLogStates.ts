import {
  Module,
  VuexModule,
  Action,
  Mutation,
  getModule
} from "vuex-module-decorators";
import store from "..";
import Vue from "vue";

interface MessageStates {
  [key: string]: MessageState
}
interface MessageState {
  scrollPosition?: number,
  bottomUnloaded?: boolean,
  isScrolledDown: boolean
}

@Module({ dynamic: true, store, namespaced: true, name: "messageLogStates" })
class MessageLogStates extends VuexModule {
  states:MessageStates = {};

  get isScrolledDown() {
    return (channelID: string) => {
      if (!this.states[channelID]) return true;
      return this.states[channelID].isScrolledDown;
    }
  }

  get scrollTop() {
    return (channelID: string) => {
      if (!this.states[channelID]) return undefined;
      return this.states[channelID].scrollPosition;
    }
  }

  @Mutation
  private UPDATE_STATE(payload: {channelID: string, state: Partial<MessageState>}) {
    if (this.states[payload.channelID]) {
      Vue.set(this.states, payload.channelID, {...this.states[payload.channelID], ...payload.state})
      return;
    } 
    Vue.set(this.states, payload.channelID, payload.state);
  }
  @Action
  public UpdateState(payload: {channelID: string, state: Partial<MessageState>}) {
    this.UPDATE_STATE(payload);
  }

}
export const MessageLogStatesModule = getModule(MessageLogStates);
