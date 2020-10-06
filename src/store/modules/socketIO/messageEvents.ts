import { ActionTree } from "vuex";
import Message from "@/interfaces/Message";
import { MessagesModule } from "../messages";
import { ChannelsModule } from "../channels";
import { MeModule } from "../me";
import { LastSeenServerChannelsModule } from "../lastSeenServerChannel";
import { NotificationsModule } from "../notifications";

const actions: ActionTree<any, any> = {
  socket_receiveMessage(context, data: { message: Message }) {
    const channel = ChannelsModule.channels[data.message.channelID];

    const isMe = data.message.creator.uniqueID === MeModule.user.uniqueID;
    ChannelsModule.updateChannel({
      channelID: data.message.channelID,
      update: { lastMessaged: Date.now() }
    });
    MessagesModule.AddChannelMessage({...data.message, type: data.message.type || 0});

    // update last seen if message created by me.
    if (isMe && channel && channel.server_id) {
      LastSeenServerChannelsModule.SetLastSeenChannel(data.message.channelID);
    }

    // send notification if:
    // message created by not me
    // channel doesn't exist || channel.server_id doesn't exist
    if (!isMe && (!channel || !channel.server_id)) {
      const notification = NotificationsModule.notificationByChannelID(
        data.message.channelID
      );
      const mentioned = !!(
        data.message.mentions &&
        data.message.mentions.find(u => u.uniqueID === MeModule.user.uniqueID)
      );
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
  }
};
export default {
  actions
};
