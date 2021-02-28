import {
  Module,
  VuexModule,
  Action,
  Mutation,
  getModule
} from "vuex-module-decorators";
import store from "..";
import { ChannelsModule } from "./channels";
import { NotificationsModule } from "./notifications";
import Vue from "vue";
import { MeModule } from "./me";
import { MutedChannelsModule } from "./mutedChannels";
import { MutedServersModule } from "./mutedServers";
interface LastSeenObj {
  [key: string]: number;
}

@Module({
  dynamic: true,
  store,
  namespaced: true,
  name: "lastSeenServerChannels"
})
class LastSeenServerChannels extends VuexModule {
  lastSeenServers: LastSeenObj = {};

  get allServerNotifications() {
    const channelIDArr = Object.keys(ChannelsModule.channels);
    const res: any = [];
    for (let i = 0; i < channelIDArr.length; i++) {
      const channelID = channelIDArr[i];
      const notificationExists = this.serverChannelNotification(channelID);
      if (notificationExists) {
        res.push(notificationExists);
      }
    }
    return res;
  }

  get serverChannelNotification() {
    return (channelID: string) => {
      if (!MeModule.connected) return undefined;
      const channel = ChannelsModule.channels[channelID];
      if (!channel) return undefined;
      if (!channel.server_id) return undefined;
      if (!channel.lastMessaged) return undefined;
      if (MutedChannelsModule.mutedChannels.includes(channelID))
        return undefined;
      if (MutedServersModule.shouldMuteServerNotification(channel.server_id)) {
        return undefined;
      }
      const lastSeenStamp = this.lastSeenServers[channel.channelID];
      if (!lastSeenStamp || lastSeenStamp < channel.lastMessaged) {
        // check if being mentioned
        const notification = NotificationsModule.notificationByChannelID(
          channelID
        );
        return {
          ...channel,
          mentioned: notification && notification.mentioned
        };
      }
      return undefined;
    };
  }

  get serverNotifications() {
    return (server_id: string) => {
      if (MutedServersModule.shouldMuteServerNotification(server_id)) {
        return [];
      }
      return this.allServerNotifications.filter(
        (channel: any) => channel.server_id === server_id
      );
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
  private SET_LAST_SEEN_CHANNEL(channelID: string) {
    Vue.set(this.lastSeenServers, channelID, Date.now());
  }

  @Action
  public SetLastSeenChannel(channelID: string) {
    this.SET_LAST_SEEN_CHANNEL(channelID);
  }
}
export const LastSeenServerChannelsModule = getModule(LastSeenServerChannels);
