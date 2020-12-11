import {
  Module,
  VuexModule,
  Action,
  Mutation,
  getModule
} from "vuex-module-decorators";
import store from "..";

@Module({ dynamic: true, store, namespaced: true, name: "messageInput" })
class MessageInput extends VuexModule {
  message = "";

  @Mutation
  private SET_MESSAGE(payload: string) {
    this.message = payload;
  }

  @Action
  public setMessage(payload: string) {
    this.SET_MESSAGE(payload);
  }
}
export const MessageInputModule = getModule(MessageInput);
