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
  CHANNEL_MUTE,
  SERVER_CHANNEL_POSITION_CHANGE
} from "@/socketEventConstants";
import { ServersModule } from "../servers";
import { MessagesModule } from "../messages";
import { NotificationsModule } from "../notifications";

const actions: ActionTree<any, any> = {
  [CHANNEL_CREATED](context, data: { channel: ChannelWithUser }) {
    if (data.channel.recipients) {
      UsersModule.AddUser(data.channel.recipients[0]);
    }
    ChannelsModule.AddChannel({
      channelID: data.channel.channelID,
      lastMessaged: data.channel.lastMessaged,
      recipients: data.channel.recipients?.map(u => u.id)
    });
  },
  [SERVER_CHANNEL_CREATED](context, data: { channel: Channel }) {
    ChannelsModule.AddChannel(data.channel);
  },
  [SERVER_CHANNEL_UPDATE](context, channel: Partial<Channel>) {
    if (!channel.channelID) return;
    MessagesModule.UpdateLastMessageSend({
      channelID: channel.channelID,
      timestamp: 0
    });
    ChannelsModule.updateChannel({
      channelID: channel.channelID,
      update: channel
    });
  },
  [SERVER_CHANNEL_REMOVED](
    context,
    data: { channelID: string; server_id: string }
  ) {
    NotificationsModule.DeleteNotification(data.channelID);
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
  },
  [SERVER_CHANNEL_POSITION_CHANGE](
    context,
    data: { serverID: string; channel_position: string[] }
  ) {
    ServersModule.UpdateServer({
      server_id: data.serverID,
      channel_position: data.channel_position
    });
  }
};
export default {
  actions
};
