import { ActionTree } from "vuex";
import Message from "@/interfaces/Message";
import { MessagesModule } from "../messages";
import { ChannelsModule } from "../channels";
import { MeModule } from "../me";
import { LastSeenServerChannelsModule } from "../lastSeenServerChannel";
import { NotificationsModule } from "../notifications";
import notificationSound from '@/utils/notificationSound';
import router from '@/router';
import { MutedChannelsModule } from '../mutedChannels';
import { MutedServersModule } from '../mutedServers';



function playNotificationSound(mentioned: boolean, channelID: string) {
  const focused = document.hasFocus();
  const channelSelected = channelID === router.currentRoute.params.channel_id;
  const tab = router.currentRoute.path.split("/")[2]

  if (MutedServersModule.shouldMuteSeverSound(channelID)) {
    return;
  }
  if (MutedChannelsModule.mutedChannels.includes(channelID)) {
    return;
  }
  if (!focused) {
    notificationSound.notification(mentioned);
    return;
  }
  if (!(channelSelected && ["dms", "servers"].includes(tab))) {
    notificationSound.notification(mentioned);
  }
}

const actions: ActionTree<any, any> = {
  socket_receiveMessage(context, data: { message: Message }) {
    const channel = ChannelsModule.channels[data.message.channelID];

    const isMe = data.message.creator.uniqueID === MeModule.user.uniqueID;
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
    }

    // send notification if:
    // message created by not me
    // server channel = mentioned
    if (!isMe) {
      const notification = NotificationsModule.notificationByChannelID(
        data.message.channelID
      );
      const mentioned = !!(
        data.message.mentions &&
        data.message.mentions.find(u => u.uniqueID === MeModule.user.uniqueID)
      );
      // play notification sound.
      playNotificationSound(mentioned, data.message.channelID);
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
  socket_deleteMessage(
    context,
    data: { channelID: string; messageID: string }
  ) {
    MessagesModule.DeleteMessage(data);
  },
  socket_updateMessage(context, data: Message) {
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
