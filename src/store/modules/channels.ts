import {
  Module,
  VuexModule,
  Action,
  Mutation,
  getModule,
} from "vuex-module-decorators";
import store from "..";
import { saveCache } from "@/utils/localCache";
import Channel from "@/interfaces/Channel";
import router from "@/router";
import { getChannelByUserId } from "@/services/channelService";
import ky from "ky";
import { UsersModule } from "./users";
import DmChannelWithUser from "@/interfaces/DmChannelWithUser";

import { ServersModule } from "./servers";
import { MessagesModule } from "./messages";
import { NotificationsModule } from "./notifications";
import { TabsModule } from "./tabs";
import { ChannelType } from "@/interfaces/DmChannel";

interface ChannelObj {
  [key: string]: Channel;
}

@Module({ dynamic: true, store, namespaced: true, name: "channels" })
class Channels extends VuexModule {
  channels: ChannelObj = {};

  get rateLimitTimeLeft() {
    return (channelId: string, nowTimeStamp: number) => {
      const rateLimit = (this.channels[channelId]?.rateLimit || 0) * 1000;
      const lastStamp = MessagesModule.lastSentStamp(channelId);
      return lastStamp - nowTimeStamp + rateLimit;
    };
  }

  get serverChannels() {
    return (id: string) =>
      Object.values(this.channels).filter((c) => {
        if (c.server_id) return c.server_id === id;
        else return false;
      });
  }

  get isChannelOpen() {
    return (channelId: string) => {
      const route = router.currentRoute.value;
      const routeName = route.name as string;
      if (!routeName?.endsWith("message-area")) return;
      return route.params.channel_id === channelId;
    };
  }

  get sortedServerChannels() {
    return (id: string) => {
      const server = ServersModule.servers[id];
      const channel_position = server.channel_position;
      if (!channel_position?.length) return this.serverChannels(id);

      return this.serverChannels(id).sort((a, b) => {
        const categoryAIndex = channel_position.indexOf(a.categoryId || "");
        const categoryBIndex = channel_position.indexOf(b.categoryId || "");

        if (categoryAIndex !== categoryBIndex)
          return categoryAIndex - categoryBIndex;

        const aIndex = channel_position.indexOf(a.channelId);
        const bIndex = channel_position.indexOf(b.channelId);
        if (aIndex < 0 || bIndex < 0) return 1;
        return aIndex - bIndex;
      });
    };
  }
  get getDMChannel() {
    return (channelId: string) => {
      const channel = this.channels[channelId];
      if (!channel) return;
      if (channel.server_id) return;
      const recipients = channel.recipients?.map((id) => UsersModule.users[id]);
      return { ...channel, recipients };
    };
  }
  get getDMChannels() {
    const filter = Object.values(this.channels).filter(
      (channel) => channel.recipients?.length && !channel.server_id
    );
    const map = filter.map((channel) => {
      const recipients = channel.recipients?.map((id) => UsersModule.users[id]);
      return { ...channel, recipients };
    });
    return map as unknown as Required<DmChannelWithUser>[];
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
    this.channels[payload.channelId] = payload;
  }
  @Action
  public AddChannel(payload: Channel) {
    this.ADD_CHANNEL(payload);
  }
  @Mutation
  private ADD_CHANNELS(payload: ChannelObj) {
    this.channels = { ...this.channels, ...payload };
  }
  @Action
  public AddChannels(payload: ChannelObj) {
    this.ADD_CHANNELS(payload);
  }
  @Mutation
  private REMOVE_CHANNEL(channelId: string) {
    delete this.channels[channelId];
  }
  @Action
  public RemoveChannel(channelId: string) {
    const channel = this.channels[channelId];
    TabsModule.tabs.forEach((tab, index) => {
      setTimeout(() => {
        if (channelId === tab.channel_id && tab.path) {
          TabsModule.closeTabByPath(tab.path);
        }
      }, index * 100);
    });
    if (channel.type === ChannelType.SERVER_CATEGORY) {
      this.removeCategoryFromChannel(channelId);
    }
    this.REMOVE_CHANNEL(channelId);
  }
  @Action
  removeCategoryFromChannel(categoryId: string) {
    const category = this.channels[categoryId];
    if (!category?.server_id) return;
    const channels = this.serverChannels(category.server_id);
    for (let index = 0; index < channels.length; index++) {
      const channel = channels[index];
      if (channel.categoryId !== categoryId) continue;
      this.updateChannel({
        channelId: channel.channelId,
        update: { categoryId: null },
      });
    }
  }
  @Action
  public DeleteAllServerChannels(serverID: string) {
    const channels = this.serverChannels(serverID);
    if (!channels?.length) return;
    for (let i = 0; i < channels.length; i++) {
      const channel = channels[i];
      NotificationsModule.DeleteNotification(channel.channelId);
      this.RemoveChannel(channel.channelId);
    }
  }
  @Action
  public LoadDmChannel(id: string) {
    const findChannel = Object.values(this.channels).find(
      (c) => c.recipients && c.recipients.includes(id)
    );
    if (findChannel) {
      router.push(`/app/dms/${findChannel?.channelId}`);
      return;
    }
    getChannelByUserId(id)
      .then((res) => {
        for (let i = 0; i < res.channel.recipients.length; i++) {
          const user = res.channel.recipients[i];
          UsersModule.AddUser(user);
        }
        this.ADD_CHANNEL({
          type: res.channel.type,
          channelId: res.channel.channelId,
          recipients: res.channel.recipients.map((u) => u.id),
        });
        router.push(`/app/dms/${res.channel.channelId}`);
      })
      .catch((err: ky.HTTPError) => {
        console.log(err.name);
        // console.log(err.response)
      });
  }

  @Mutation
  private UPDATE_CHANNEL(payload: {
    channelId: string;
    update: Partial<Channel>;
  }) {
    Object.assign(this.channels[payload.channelId], payload.update);
  }
  @Action
  public updateChannel(payload: {
    channelId: string;
    update: Partial<Channel>;
  }) {
    if (!this.channels[payload.channelId]) return;
    this.UPDATE_CHANNEL(payload);
  }
}
export const ChannelsModule = getModule(Channels);
