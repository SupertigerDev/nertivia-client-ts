import ChannelWithUser from "@/interfaces/DmChannelWithUser";
import { UsersModule } from "@/store/modules/users";
import { ChannelsModule } from "@/store/modules/channels";
import Channel from "@/interfaces/Channel";
import { MessagesModule } from "@/store/modules/messages";
import { NotificationsModule } from "@/store/modules/notifications";
import { MutedChannelsModule } from "@/store/modules/mutedChannels";
import { ServersModule } from "@/store/modules/servers";
import { voiceChannelModule } from "@/store/modules/voiceChannels";

export const onChannelCreated = (data: { channel: ChannelWithUser }) => {
  if (data.channel.recipients) {
    UsersModule.AddUser(data.channel.recipients[0]);
  }
  ChannelsModule.AddChannel({
    type: data.channel.type,
    categoryId: null,
    channelID: data.channel.channelID,
    lastMessaged: data.channel.lastMessaged,
    recipients: data.channel.recipients?.map((u) => u.id),
  });
};

export const onServerChannelCreated = (data: { channel: Channel }) => {
  ChannelsModule.AddChannel(data.channel);
};
export const onServerChannelUpdate = (channel: Partial<Channel>) => {
  if (!channel.channelID) return;
  MessagesModule.UpdateLastMessageSend({
    channelID: channel.channelID,
    timestamp: 0,
  });
  ChannelsModule.updateChannel({
    channelID: channel.channelID,
    update: channel,
  });
};
export const onServerChannelRemoved = (data: {
  channelID: string;
  server_id: string;
}) => {
  const joinedVoiceChanneId = voiceChannelModule.joinedChannelId;
  if (joinedVoiceChanneId === data.channelID) {
    voiceChannelModule.leave();
  }
  NotificationsModule.DeleteNotification(data.channelID);
  ChannelsModule.RemoveChannel(data.channelID);
};
export const onChannelRemoved = (data: { channelID: string }) => {
  ChannelsModule.RemoveChannel(data.channelID);
};
export const onChannelUnmute = (data: { channelID: string }) => {
  MutedChannelsModule.RemoveMutedChannel(data.channelID);
};
export const onChannelMute = (data: { channelID: string }) => {
  MutedChannelsModule.AddMutedChannel(data.channelID);
};

interface Category {
  id: string;
  channelId: string | null;
}

export const onServerChannelPositionChange = (data: {
  serverID: string;
  channel_position: string[];
  category: null | Category;
}) => {
  if (data.category?.channelId) {
    ChannelsModule.updateChannel({
      channelID: data.category.channelId,
      update: { categoryId: data.category.id },
    });
  }
  ServersModule.UpdateServer({
    server_id: data.serverID,
    channel_position: data.channel_position,
  });
};
