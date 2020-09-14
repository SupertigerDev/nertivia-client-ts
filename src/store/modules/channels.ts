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

interface ChannelObj {
  [key: string]: Channel;
}

@Module({ dynamic: true, store, namespaced: true, name: "channels" })
class Channels extends VuexModule {
  channels: ChannelObj = {};

  get serverChannels() {
    return (id: string) =>
      Object.values(this.channels).filter(c => c.server_id === id);
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
}
export const ChannelsModule = getModule(Channels);
