import Notification from "@/interfaces/Notification";

import {
  Module,
  VuexModule,
  Action,
  Mutation,
  getModule,
} from "vuex-module-decorators";
import store from "..";
import { ChannelsModule } from "./channels";

interface NotificationObj {
  [key: string]: Notification;
}

@Module({ dynamic: true, store, namespaced: true, name: "notifications" })
class Notifications extends VuexModule {
  notifications: NotificationObj = {};

  get newDMNotifications() {
    return Object.values(this.notifications).filter(
      (n) => !ChannelsModule.channels[n.channelId]
    );
  }
  get allDMNotifications() {
    return Object.values(this.notifications).filter((n) => {
      const channel = ChannelsModule.channels[n.channelId];
      if (!channel) return true;
      if (channel.server_id) return false;
      return true;
    });
  }

  get notificationByChannelID() {
    return (channelId: string) => this.notifications[channelId];
  }

  get notificationByUserID() {
    return (id: string) =>
      Object.values(this.notifications).find((n) => {
        const channel = ChannelsModule.channels[n.channelId];
        if (channel && channel.server_id) return false;
        return n.sender.id === id;
      });
  }

  @Mutation
  private INIT_NOTIFICATIONS(notification: NotificationObj | any) {
    this.notifications = notification;
  }

  @Action
  public InitNotifications(notification: NotificationObj | any) {
    this.INIT_NOTIFICATIONS(notification);
  }
  @Mutation
  private DELETE_NOTIFICATION(channelId: string) {
    delete this.notifications[channelId];
  }

  @Action
  public DeleteNotification(channelId: string) {
    this.DELETE_NOTIFICATION(channelId);
  }

  @Mutation
  private ADD_NOTIFICATION(payload: {
    channelId: string;
    notification: Notification;
  }) {
    this.notifications[payload.channelId] = payload.notification;
  }
  @Action
  public AddNotification(payload: {
    channelId: string;
    notification: Notification;
  }) {
    this.ADD_NOTIFICATION({
      channelId: payload.channelId,
      notification: payload.notification,
    });
  }
  @Action
  public UpdateNotification(payload: {
    channelId: string;
    notification: Partial<Notification>;
  }) {
    const currentNotification = this.notifications[payload.channelId];
    this.ADD_NOTIFICATION({
      channelId: payload.channelId,
      notification: { ...currentNotification, ...payload.notification },
    });
  }
}
export const NotificationsModule = getModule(Notifications);
