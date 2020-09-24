import {
  Module,
  VuexModule,
  Action,
  Mutation,
  getModule
} from "vuex-module-decorators";
import store from "..";
import { saveCache } from "@/utils/localCache";
import Channel from "@/interfaces/Channel";
import DmChannel from "@/interfaces/DMChannel";
import router from "@/router";
import { getChannelByUserId } from "@/services/channelService";
import ky from "ky";
import { UsersModule } from "./users";

interface ChannelObj {
  [key: string]: Channel;
}

@Module({ dynamic: true, store, namespaced: true, name: "channels" })
class Channels extends VuexModule {
  channels: ChannelObj = {};

  get serverChannels() {
    return (id: string) =>
      Object.values(this.channels).filter(c => {
        if (c.server_id) return c.server_id === id;
        else return false;
      });
  }
  get getDMChannel() {
    return (channelID: string) => {
      const channel = this.channels[channelID];
      if (!channel) return;
      const recipients = channel.recipients?.map(
        uniqueID => UsersModule.users[uniqueID]
      );
      return { ...channel, recipients };
    };
  }
  get getDMChannels() {
    const filter = Object.values(this.channels).filter(channel => channel.recipients);
    const map = filter.map(channel => {
      const recipients = channel.recipients?.map(
        uniqueID => UsersModule.users[uniqueID]
      );
      return { ...channel, recipients };
    })
    return map;
  }

  @Mutation
  private INIT_CHANNELS(payload: ChannelObj | any) {
    this.channels = payload;
  }
  @Action
  public InitChannels(payload: ChannelObj | any) {
    saveCache("channels", payload);
    this.INIT_CHANNELS(payload);
  }
  @Mutation
  private ADD_CHANNEL(payload: Channel) {
    this.channels[payload.channelID] = payload;
  }
  @Action
  public LoadDmChannel(uniqueID: string) {
    const findChannel = Object.values(this.channels).find(
      c => c.recipients && c.recipients.includes(uniqueID)
    );
    if (findChannel) {
      router.push(`/app/dms/${findChannel?.channelID}`);
      return;
    }
    getChannelByUserId(uniqueID)
      .then(res => {
        for (let i = 0; i < res.channel.recipients.length; i++) {
          const user = res.channel.recipients[i];
          UsersModule.AddUser(user);
        }
        this.ADD_CHANNEL({
          channelID: res.channel.channelID,
          recipients: res.channel.recipients.map(u => u.uniqueID)
        });
        router.push(`/app/dms/${res.channel.channelID}`);
      })
      .catch((err: ky.HTTPError) => {
        console.log(err.name);
        // console.log(err.response)
      });
  }
}
export const ChannelsModule = getModule(Channels);
