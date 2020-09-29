import User from '@/interfaces/User';
import { uniq } from 'lodash';
import {
  Module,
  VuexModule,
  Action,
  Mutation,
  getModule
} from "vuex-module-decorators";
import store from "..";
import { ChannelsModule } from './channels';

interface Notification {
  channelID: string
  count: number
  lastMessageID: string
  mentioned: boolean
  recipient: string
  sender: User
  type: string
}

@Module({ dynamic: true, store, namespaced: true, name: "notifications" })
class Notifications extends VuexModule {
  notification: Notification[] = [];

  get newDMNotifications() {
    return this.notification.filter(n => !ChannelsModule.channels[n.channelID])
  }
  get notificationByChannelID() {
    return (channelID: string) => this.notification.find(n => n.channelID === channelID)
  }
  get notificationByUniqueID() {
    return (uniqueID: string) => this.notification.find(n => n.sender.uniqueID === uniqueID)
  }

  @Mutation
  private INIT_NOTIFICATIONS(notification: Notification | any) {
    this.notification = notification;
  }

  @Action
  public InitNotifications(notification: Notification | any) {
    this.INIT_NOTIFICATIONS(notification);
  }
}
export const NotificationsModule = getModule(Notifications);
