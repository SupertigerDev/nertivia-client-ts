import { ActionTree } from "vuex";
import Message from "@/interfaces/Message";
import { MessagesModule } from "../messages";

const actions: ActionTree<any, any> = {
  socket_receiveMessage(context, data: { message: Message }) {
    MessagesModule.AddChannelMessage(data.message);
  }
};
export default {
  actions
};
