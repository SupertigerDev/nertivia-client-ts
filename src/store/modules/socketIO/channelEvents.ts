import Channel from "@/interfaces/Channel";
import ChannelWithUser from "@/interfaces/DmChannelWithUser";
import { ActionTree } from "vuex";
import { ChannelsModule } from "../channels";
import { MutedChannelsModule } from "../mutedChannels";
import { UsersModule } from "../users";
import {
  CHANNEL_CREATED,
  SERVER_CHANNEL_CREATED,
  SERVER_CHANNEL_UPDATE,
  CHANNEL_REMOVED,
  SERVER_CHANNEL_REMOVED,
  CHANNEL_UNMUTE,
  CHANNEL_MUTE
} from "@/socketEventConstants";

const actions: ActionTree<any, any> = {
  [CHANNEL_CREATED](context, data: { channel: ChannelWithUser }) {
    if (data.channel.recipients) {
      UsersModule.AddUser(data.channel.recipients[0]);
    }
    ChannelsModule.AddChannel({
      channelID: data.channel.channelID,
      lastMessaged: data.channel.lastMessaged,
      recipients: data.channel.recipients?.map(u => u.uniqueID)
    });
  },
  [SERVER_CHANNEL_CREATED](context, data: { channel: Channel }) {
    ChannelsModule.AddChannel(data.channel);
  },
  [SERVER_CHANNEL_UPDATE](context, channel: Partial<Channel>) {
    if (!channel.channelID) return;
    ChannelsModule.updateChannel({
      channelID: channel.channelID,
      update: channel
    });
  },
  [SERVER_CHANNEL_REMOVED](
    context,
    data: { channelID: string; server_id: string }
  ) {
    ChannelsModule.RemoveChannel(data.channelID);
  },

  [CHANNEL_REMOVED](context, data: { channelID: string }) {
    ChannelsModule.RemoveChannel(data.channelID);
  },
  [CHANNEL_UNMUTE](context, data: { channelID: string }) {
    MutedChannelsModule.RemoveMutedChannel(data.channelID);
  },
  [CHANNEL_MUTE](context, data: { channelID: string }) {
    MutedChannelsModule.AddMutedChannel(data.channelID);
  }
};
export default {
  actions
};
