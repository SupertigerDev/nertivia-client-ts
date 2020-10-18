import Notification from '@/interfaces/Notification';
import Vue from "vue";
import {
  Module,
  VuexModule,
  Action,
  Mutation,
  getModule
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
      n => !ChannelsModule.channels[n.channelID]
    );
  }
  get allDMNotifications() {
    return Object.values(this.notifications).filter(n => {
      const channel = ChannelsModule.channels[n.channelID];
      if (!channel) return true;
      if (channel.server_id) return false;
      return true;
    });
  }

  get notificationByChannelID() {
    return (channelID: string) => this.notifications[channelID];
  }

  get notificationByUniqueID() {
    return (uniqueID: string) =>
      Object.values(this.notifications).find(n => {
        const channel = ChannelsModule.channels[n.channelID];
        if (channel && channel.server_id) return false;
        return n.sender.uniqueID === uniqueID;
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
  private DELETE_NOTIFICATION(channelID: string) {
    Vue.delete(this.notifications, channelID);
  }

  @Action
  public DeleteNotification(channelID: string) {
    this.DELETE_NOTIFICATION(channelID);
  }

  @Mutation
  private ADD_NOTIFICATION(payload: {
    channelID: string;
    notification: Notification;
  }) {
    Vue.set(this.notifications, payload.channelID, payload.notification);
  }
  @Action
  public AddNotification(payload: {
    channelID: string;
    notification: Notification;
  }) {
    this.ADD_NOTIFICATION({
      channelID: payload.channelID,
      notification: payload.notification
    });
  }
  @Action
  public UpdateNotification(payload: {
    channelID: string;
    notification: Partial<Notification>;
  }) {
    const currentNotification = this.notifications[payload.channelID];
    this.ADD_NOTIFICATION({
      channelID: payload.channelID,
      notification: { ...currentNotification, ...payload.notification }
    });
  }
}
export const NotificationsModule = getModule(Notifications);
