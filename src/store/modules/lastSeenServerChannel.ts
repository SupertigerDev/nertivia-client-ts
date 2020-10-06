import {
  Module,
  VuexModule,
  Action,
  Mutation,
  getModule
} from "vuex-module-decorators";
import store from "..";
import { ChannelsModule } from "./channels";

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
    return Object.values(ChannelsModule.channels).filter(channel => {
      if (!channel.server_id) return false;
      if (!channel.lastMessaged) return false;
      const lastSeenStamp = this.lastSeenServers[channel.channelID];
      if (!lastSeenStamp) return false;
      return lastSeenStamp < channel.lastMessaged;
    });
  }

  get serverChannelNotification() {
    return (channelID: string) => {
      const channel = ChannelsModule.channels[channelID];
      if (!channel) return undefined;
      if (!channel.server_id) return undefined;
      if (!channel.lastMessaged) return undefined;
      const lastSeenStamp = this.lastSeenServers[channel.channelID];
      if (!lastSeenStamp) return undefined;
      if (lastSeenStamp < channel.lastMessaged) {
        return channel;
      }
      return undefined;
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
    this.lastSeenServers[channelID] = Date.now();
  }

  @Action
  public SetLastSeenChannel(channelID: string) {
    this.SET_LAST_SEEN_CHANNEL(channelID);
  }
}
export const LastSeenServerChannelsModule = getModule(LastSeenServerChannels);
