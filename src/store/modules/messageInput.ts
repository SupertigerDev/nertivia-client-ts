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
  editingMessageID:string | null = null

  @Mutation
  private SET_MESSAGE(payload: string) {
    this.message = payload;
  }

  @Action
  public setMessage(payload: string) {
    this.SET_MESSAGE(payload);
  }

  @Mutation
  private SET_EDITING_MESSAGE(messageID: string | null) {
    this.editingMessageID = messageID;
  }

  @Action
  public SetEditingMessage(messageID: string | null) {
    this.SET_EDITING_MESSAGE(messageID);
  }
}
export const MessageInputModule = getModule(MessageInput);
