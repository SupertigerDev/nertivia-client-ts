import { ActionTree } from "vuex";
import Message from "@/interfaces/Message";
import { MessagesModule } from "../messages";
import { ChannelsModule } from "../channels";
import { MeModule } from "../me";
import { LastSeenServerChannelsModule } from "../lastSeenServerChannel";
import { NotificationsModule } from "../notifications";
import notificationSound from "@/utils/notificationSound";
import router from "@/router";
import { MutedChannelsModule } from "../mutedChannels";
import { MutedServersModule } from "../mutedServers";
import { eventBus } from "@/utils/globalBus";
import {
  RECEIVE_MESSAGE,
  DELETE_MESSAGE,
  UPDATE_MESSAGE
} from "@/socketEventConstants";
import { MessageLogStatesModule } from "../messageLogStates";

function playNotificationSound(
  mentioned: boolean,
  channelID: string,
  serverID?: string
) {
  const focused = document.hasFocus();
  const channelSelected = ChannelsModule.isChannelOpen(channelID);
  const tab = router.currentRoute.path.split("/")[2];
  const scrolledDown = MessageLogStatesModule.isScrolledDown(channelID);

  if (serverID && MutedServersModule.shouldMuteServerSound(serverID)) {
    return;
  }
  if (MutedChannelsModule.mutedChannels.includes(channelID)) {
    return;
  }
  if (!focused) {
    notificationSound.notification(mentioned);
    return;
  }
  if (!scrolledDown) {
    notificationSound.notification(mentioned);
    return;
  }
  if (!(channelSelected && ["dms", "servers"].includes(tab))) {
    notificationSound.notification(mentioned);
  }
}

const actions: ActionTree<any, any> = {
  [RECEIVE_MESSAGE](context, data: { message: Message }) {
    const channel = ChannelsModule.channels[data.message.channelID];

    const isMe = data.message.creator.id === MeModule.user.id;
    ChannelsModule.updateChannel({
      channelID: data.message.channelID,
      update: { lastMessaged: Date.now() }
    });
    MessagesModule.AddChannelMessage({
      ...data.message,
      type: data.message.type || 0
    });

    // update last seen if message created by me.
    if (isMe && channel && channel.server_id) {
      LastSeenServerChannelsModule.SetLastSeenChannel(data.message.channelID);
      if (data.message.type === 0)
        MessagesModule.UpdateLastMessageSend({channelID: channel.channelID, timestamp: Date.now()})
    }

    // send notification if:
    // message created by not me
    // server channel = mentioned
    if (!isMe) {
      eventBus.$emit("newMessage", data.message);
      const notification = NotificationsModule.notificationByChannelID(
        data.message.channelID
      );
      const mentioned = !!(
        data.message.mentions &&
        data.message.mentions.find(u => u.id === MeModule.user.id)
      );
      // play notification sound.
      playNotificationSound(
        mentioned,
        data.message.channelID,
        channel?.server_id
      );
      if (channel && channel.server_id && !mentioned) return;
      if (notification) {
        const updateNotification: any = {
          count: notification.count + 1
        };
        if (mentioned) updateNotification.mentioned = true;
        NotificationsModule.UpdateNotification({
          channelID: data.message.channelID,
          notification: updateNotification
        });
      } else {
        NotificationsModule.AddNotification({
          channelID: data.message.channelID,
          notification: {
            channelID: data.message.channelID,
            count: 1,
            lastMessageID: data.message.messageID as any,
            sender: data.message.creator,
            mentioned: mentioned
          }
        });
      }
    }
  },
  [DELETE_MESSAGE](context, data: { channelID: string; messageID: string }) {
    MessagesModule.DeleteMessage(data);
  },
  [UPDATE_MESSAGE](context, data: Message) {
    MessagesModule.UpdateMessage({
      channelID: data.channelID,
      messageID: data.messageID,
      message: data
    });
  }
};

export default {
  actions
};
