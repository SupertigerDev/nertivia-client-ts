import { ActionTree } from "vuex";
import Message from "@/interfaces/Message";
import { MessagesModule } from "../messages";
import { ChannelsModule } from "../channels";
import { MeModule } from "../me";

const actions: ActionTree<any, any> = {
  socket_receiveMessage(context, data: { message: Message }) {
    const isMe = data.message.creator.uniqueID === MeModule.user.uniqueID;
    if (!isMe) {
      ChannelsModule.updateChannel({
        channelID: data.message.channelID,
        update: { lastMessaged: Date.now() }
      });
    }
    MessagesModule.AddChannelMessage(data.message);
  }
};
export default {
  actions
};
