import Channel from "@/interfaces/Channel";
import ChannelWithUser from "@/interfaces/DmChannelWithUser";
import { ActionTree } from "vuex";
import { ChannelsModule } from "../channels";
import { MutedChannelsModule } from "../mutedChannels";
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
  ["socket_server:addChannel"](context, data: {channel: Channel}) {
    ChannelsModule.AddChannel(data.channel)
  },
  ["socket_server:updateChannel"](context, channel: Partial<Channel>) {
    if (!channel.channelID) return;
    ChannelsModule.updateChannel({channelID: channel.channelID, update: channel})
  },
  ["socket_server:removeChannel"](context, data: {channelID: string, server_id: string}) {
    ChannelsModule.RemoveChannel(data.channelID);
  },

  ["socket_channel:remove"](context, data: { channelID: string }) {
    ChannelsModule.RemoveChannel(data.channelID);
  },
  ["socket_channel:unmute"](context, data: { channelID: string }) {
    MutedChannelsModule.RemoveMutedChannel(data.channelID);
  },
  ["socket_channel:mute"](context, data: { channelID: string }) {
    MutedChannelsModule.AddMutedChannel(data.channelID);
  }
};
export default {
  actions
};
