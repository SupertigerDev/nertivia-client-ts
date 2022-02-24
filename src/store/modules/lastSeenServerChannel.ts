import {
  Module,
  VuexModule,
  Action,
  Mutation,
  getModule,
} from "vuex-module-decorators";
import store from "..";
import { ChannelsModule } from "./channels";
import { NotificationsModule } from "./notifications";

import { MeModule } from "./me";
import { MutedChannelsModule } from "./mutedChannels";
import { MutedServersModule } from "./mutedServers";
import Channel from "@/interfaces/Channel";
interface LastSeenObj {
  [key: string]: number;
}

@Module({
  dynamic: true,
  store,
  namespaced: true,
  name: "lastSeenServerChannels",
})
class LastSeenServerChannels extends VuexModule {
  lastSeenServers: LastSeenObj = {};

  get allServerNotifications() {
    const channelIDArr = Object.keys(ChannelsModule.channels);
    const res: (Channel & { mentioned?: boolean })[] = [];
    for (let i = 0; i < channelIDArr.length; i++) {
      const channelId = channelIDArr[i];
      const notificationExists = this.serverChannelNotification(channelId);
      if (notificationExists) {
        res.push(notificationExists);
      }
    }
    return res;
  }

  get serverChannelNotification() {
    return (channelId: string) => {
      if (!MeModule.connected) return undefined;
      const channel = ChannelsModule.channels[channelId];
      if (!channel) return undefined;
      if (!channel.server_id) return undefined;
      if (!channel.lastMessaged) return undefined;
      if (MutedChannelsModule.mutedChannels.includes(channelId))
        return undefined;
      if (MutedServersModule.shouldMuteServerNotification(channel.server_id)) {
        return undefined;
      }
      const lastSeenStamp = this.lastSeenServers[channel.channelId];
      if (!lastSeenStamp || lastSeenStamp < channel.lastMessaged) {
        // check if being mentioned
        const notification =
          NotificationsModule.notificationByChannelID(channelId);
        return {
          ...channel,
          mentioned: notification && notification.mentioned,
        } as Channel & { mentioned?: boolean };
      }
      return undefined;
    };
  }

  get serverNotifications() {
    return (server_id: string, categoryId?: string) => {
      if (MutedServersModule.shouldMuteServerNotification(server_id)) {
        return [];
      }
      const channels = ChannelsModule.serverChannels(server_id);
      const res: (Channel & { mentioned?: boolean })[] = [];
      for (let i = 0; i < channels.length; i++) {
        const channel = channels[i];
        if (categoryId && channel.categoryId !== categoryId) continue;
        const notificationExists = this.serverChannelNotification(
          channel.channelId
        );
        if (notificationExists) {
          res.push(notificationExists);
        }
      }
      return res;
    };
  }

  @Mutation
  private INIT_LAST_SEEN(payload: LastSeenObj | any) {
    this.lastSeenServers = payload;
  }

  @Action
  public InitLastSeen(payload: LastSeenObj | any) {
    this.INIT_LAST_SEEN(payload);
  }

  @Mutation
  private SET_LAST_SEEN_CHANNEL(channelId: string) {
    this.lastSeenServers[channelId] = Date.now();
  }

  @Action
  public SetLastSeenChannel(channelId: string) {
    this.SET_LAST_SEEN_CHANNEL(channelId);
  }
}
export const LastSeenServerChannelsModule = getModule(LastSeenServerChannels);
