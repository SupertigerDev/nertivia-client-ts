import { ActionTree } from "vuex";
import Message from "@/interfaces/Message";
import { MessagesModule } from "../messages";
import { ChannelsModule } from "../channels";
import { MeModule } from "../me";
import { LastSeenServerChannelsModule } from '../lastSeenServerChannel';

const actions: ActionTree<any, any> = {
  socket_receiveMessage(context, data: { message: Message }) {
    const channel = ChannelsModule.channels[data.message.channelID];

    const isMe = data.message.creator.uniqueID === MeModule.user.uniqueID;
    ChannelsModule.updateChannel({
      channelID: data.message.channelID,
      update: { lastMessaged: Date.now() }
    });
    MessagesModule.AddChannelMessage(data.message);
    
    if (isMe && channel && channel.server_id) {
      LastSeenServerChannelsModule.SetLastSeenChannel(data.message.channelID)
    }
  }
};
export default {
  actions
};
