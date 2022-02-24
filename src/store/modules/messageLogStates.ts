import {
  Module,
  VuexModule,
  Action,
  Mutation,
  getModule,
} from "vuex-module-decorators";
import store from "..";

interface MessageStates {
  [key: string]: MessageState;
}
interface MessageState {
  scrollPosition?: number;
  bottomUnloaded?: boolean;
  isScrolledDown: boolean;
}

@Module({ dynamic: true, store, namespaced: true, name: "messageLogStates" })
class MessageLogStates extends VuexModule {
  states: MessageStates = {};

  get isScrolledDown() {
    return (channelId: string) => {
      if (!this.states[channelId]) return true;
      return this.states[channelId].isScrolledDown;
    };
  }
  get isBottomUnloaded() {
    return (channelId: string) => {
      if (!this.states[channelId]) return false;
      return this.states[channelId].bottomUnloaded;
    };
  }

  get scrollTop() {
    return (channelId: string) => {
      if (!this.states[channelId]) return undefined;
      return this.states[channelId].scrollPosition;
    };
  }

  @Mutation
  private UPDATE_STATE(payload: {
    channelId: string;
    state: Partial<MessageState>;
  }) {
    if (this.states[payload.channelId]) {
      this.states[payload.channelId] = {
        ...this.states[payload.channelId],
        ...payload.state,
      };
      return;
    }
    this.states[payload.channelId] = payload.state as MessageState;
  }
  @Action
  public UpdateState(payload: {
    channelId: string;
    state: Partial<MessageState>;
  }) {
    this.UPDATE_STATE(payload);
  }
  @Mutation
  private REMOVE_STATE(channelId: string) {
    delete this.states[channelId];
  }
  @Action
  public RemoveState(channelId: string) {
    this.REMOVE_STATE(channelId);
  }
}
export const MessageLogStatesModule = getModule(MessageLogStates);
