import Message, { Reaction } from "@/interfaces/Message";
import router from "@/router";
import { ChannelsModule } from "@/store/modules/channels";
import { LastSeenServerChannelsModule } from "@/store/modules/lastSeenServerChannel";
import { MeModule } from "@/store/modules/me";
import { MessageLogStatesModule } from "@/store/modules/messageLogStates";
import { MessagesModule } from "@/store/modules/messages";
import { MutedChannelsModule } from "@/store/modules/mutedChannels";
import { MutedServersModule } from "@/store/modules/mutedServers";
import { NotificationsModule } from "@/store/modules/notifications";
import { emitter } from "@/utils/globalBus";
import notificationSound from "@/utils/notificationSound";
import { Socket } from "socket.io-client";

interface PlayNotificationData {
  mentioned: boolean;
  channelID: string;
  serverID?: string;
}

function isDirectMessage(server: any) {
  if(server === undefined) {
    return true;
  }
  return false;
}

function playNotificationSound(data: PlayNotificationData) {
  const focused = document.hasFocus();
  const channelSelected = ChannelsModule.isChannelOpen(data.channelID);
  const tab = router.currentRoute.value.path.split("/")[2];
  const scrolledDown = MessageLogStatesModule.isScrolledDown(data.channelID);
  const muteServer =
    data.serverID && MutedServersModule.serverSoundMuted(data.serverID);
  const dm = isDirectMessage(data.serverID);  

  if (muteServer) {
    return;
  }
  if (MutedChannelsModule.mutedChannels.includes(data.channelID)) {
    return;
  }
  if (!focused) {
    notificationSound.notification(data.mentioned, dm);
    return;
  }
  if (!scrolledDown) {
    notificationSound.notification(data.mentioned, dm);
    return;
  }
  if (!(channelSelected && ["dms", "servers"].includes(tab))) {
    notificationSound.notification(data.mentioned, dm);
  }
}

export const onMessage = (socket: Socket, data: { message: Message }) => {
  const channel = ChannelsModule.channels[data.message.channelID];

  const isMe = data.message.creator.id === MeModule.user.id;
  ChannelsModule.updateChannel({
    channelID: data.message.channelID,
    update: { lastMessaged: Date.now() },
  });
  MessagesModule.AddChannelMessage({
    ...data.message,
    type: data.message.type || 0,
  });

  // update last seen if message created by me.
  if (isMe && channel && channel.server_id) {
    LastSeenServerChannelsModule.SetLastSeenChannel(data.message.channelID);
    if (data.message.type === 0)
      MessagesModule.UpdateLastMessageSend({
        channelID: channel.channelID,
        timestamp: Date.now(),
      });
  }

  // send notification if:
  // message created by not me
  // server channel = mentioned
  if (!isMe) {
    emitter.emit("newMessage", data.message);
    const notification = NotificationsModule.notificationByChannelID(
      data.message.channelID
    );
    const mentioned = !!(
      data.message.mentions &&
      data.message.mentions.find((u) => u.id === MeModule.user.id)
    );
    // play notification sound.
    playNotificationSound({
      mentioned,
      channelID: data.message.channelID,
      serverID: channel?.server_id,
    });
    if (channel && channel.server_id && !mentioned) return;
    if (notification) {
      const updateNotification: any = {
        count: notification.count + 1,
      };
      if (mentioned) updateNotification.mentioned = true;
      NotificationsModule.UpdateNotification({
        channelID: data.message.channelID,
        notification: updateNotification,
      });
    } else {
      NotificationsModule.AddNotification({
        channelID: data.message.channelID,
        notification: {
          channelID: data.message.channelID,
          count: 1,
          lastMessageID: data.message.messageID as any,
          sender: data.message.creator,
          mentioned: mentioned,
        },
      });
    }
  }
};

interface DeleteData {
  channelID: string;
  messageID: string;
}
interface DeleteBulkData {
  channelId: string;
  messageIds: string[];
}

export const onMessageDelete = (socket: Socket, data: DeleteData) => {
  MessagesModule.DeleteMessage(data);
};
export const onMessageDeleteBulk = (socket: Socket, data: DeleteBulkData) => {
  MessagesModule.deleteBulk(data);
};
export const onMessageUpdate = (socket: Socket, data: Message) => {
  MessagesModule.UpdateMessage({
    channelID: data.channelID,
    messageID: data.messageID,
    message: data,
  });
};

interface MessageReaction {
  channelID: string;
  messageID: string;
  reactedByUserID?: string;
  unReactedByUserID?: string;
  reaction: Reaction;
}
export const onReactionUpdate = (socket: Socket, data: MessageReaction) => {
  const reactedByMe = data.reactedByUserID === MeModule.user.id;
  const unReactedByMe = data.unReactedByUserID === MeModule.user.id;
  if (reactedByMe === true) {
    data.reaction.reacted = true;
  }
  if (unReactedByMe) {
    data.reaction.reacted = false;
  }
  MessagesModule.UpdateMessageReaction({
    channelID: data.channelID,
    messageID: data.messageID,
    reaction: data.reaction,
    removeIfZero: true,
  });
};
