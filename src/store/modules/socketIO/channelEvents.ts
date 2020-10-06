import ChannelWithUser from "@/interfaces/DmChannelWithUser";
import { ActionTree } from "vuex";
import { ChannelsModule } from "../channels";
import { UsersModule } from "../users";

const actions: ActionTree<any, any> = {
  ["socket_channel:created"](context, data: { channel: ChannelWithUser }) {
    if (data.channel.recipients) {
      UsersModule.AddUser(data.channel.recipients[0]);
    }
    ChannelsModule.AddChannel({
      channelID: data.channel.channelID,
      lastMessaged: data.channel.lastMessaged,
      recipients: data.channel.recipients?.map(u => u.uniqueID)
    });
  },

  ["socket_channel:remove"](context, data: { channelID: string }) {
    ChannelsModule.RemoveChannel(data.channelID);
  }
};
export default {
  actions
};
