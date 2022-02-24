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
    channelId: data.channel.channelId,
    lastMessaged: data.channel.lastMessaged,
    recipients: data.channel.recipients?.map((u) => u.id),
  });
};

export const onServerChannelCreated = (data: { channel: Channel }) => {
  ChannelsModule.AddChannel(data.channel);
};
export const onServerChannelUpdate = (channel: Partial<Channel>) => {
  if (!channel.channelId) return;
  MessagesModule.UpdateLastMessageSend({
    channelId: channel.channelId,
    timestamp: 0,
  });
  ChannelsModule.updateChannel({
    channelId: channel.channelId,
    update: channel,
  });
};
export const onServerChannelRemoved = (data: {
  channelId: string;
  server_id: string;
}) => {
  const joinedVoiceChanneId = voiceChannelModule.joinedchannelId;
  if (joinedVoiceChanneId === data.channelId) {
    voiceChannelModule.leave();
  }
  NotificationsModule.DeleteNotification(data.channelId);
  ChannelsModule.RemoveChannel(data.channelId);
};
export const onChannelRemoved = (data: { channelId: string }) => {
  ChannelsModule.RemoveChannel(data.channelId);
};
export const onChannelUnmute = (data: { channelId: string }) => {
  MutedChannelsModule.RemoveMutedChannel(data.channelId);
};
export const onChannelMute = (data: { channelId: string }) => {
  MutedChannelsModule.AddMutedChannel(data.channelId);
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
      channelId: data.category.channelId,
      update: { categoryId: data.category.id },
    });
  }
  ServersModule.UpdateServer({
    server_id: data.serverID,
    channel_position: data.channel_position,
  });
};
