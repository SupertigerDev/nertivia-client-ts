import Message from "@/interfaces/Message";
import { revertFormat } from "@/utils/formatMessage";
import {
  Module,
  VuexModule,
  Action,
  Mutation,
  getModule,
} from "vuex-module-decorators";
import store from "..";

@Module({ dynamic: true, store, namespaced: true, name: "messageInput" })
class MessageInput extends VuexModule {
  message = "";
  editingMessage: Message | null = null;

  @Mutation
  private SET_MESSAGE(payload: string) {
    this.message = payload;
  }

  @Action
  public setMessage(payload: string) {
    this.SET_MESSAGE(payload);
  }

  @Mutation
  private SET_EDITING_MESSAGE(message: Message | null) {
    this.editingMessage = message;
  }

  @Action
  public SetEditingMessage(message: Message | null) {
    this.SET_EDITING_MESSAGE(message);
    this.setMessage(revertFormat(message?.message || ""));
  }
}
export const MessageInputModule = getModule(MessageInput);
