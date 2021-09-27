import {
  Module,
  VuexModule,
  Action,
  Mutation,
  getModule,
} from "vuex-module-decorators";
import store from "..";

@Module({ dynamic: true, store, namespaced: true, name: "mutedChannels" })
class MutedChannels extends VuexModule {
  mutedChannels: string[] = [];

  @Mutation
  private SET_MUTED_CHANNELS(payload: string[]) {
    this.mutedChannels = payload;
  }

  @Action
  public SetMutedChannels(payload: string[]) {
    this.SET_MUTED_CHANNELS(payload);
  }
  @Mutation
  private ADD_MUTED_CHANNEL(payload: string) {
    this.mutedChannels.push(payload);
  }

  @Action
  public AddMutedChannel(payload: string) {
    this.ADD_MUTED_CHANNEL(payload);
  }
  @Mutation
  private REMOVE_MUTED_CHANNEL(payload: string) {
    this.mutedChannels = this.mutedChannels.filter((id) => id !== payload);
  }

  @Action
  public RemoveMutedChannel(payload: string) {
    this.REMOVE_MUTED_CHANNEL(payload);
  }
}
export const MutedChannelsModule = getModule(MutedChannels);
