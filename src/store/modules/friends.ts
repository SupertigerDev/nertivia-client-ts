import {
  Module,
  VuexModule,
  Action,
  Mutation,
  getModule
} from "vuex-module-decorators";
import store from "..";
import User from "@/interfaces/User";
import { saveCache } from "@/utils/localCache";
import { PresencesModule } from "./presences";

import Vue from 'vue';

interface FriendObj {
  [key: string]: {
    status: number;
    uniqueID: string;
  };
}

@Module({ dynamic: true, store, namespaced: true, name: "friends" })
class Friends extends VuexModule {
  friends: FriendObj = {};

  get friendWithUser() {
    return (id: string) => {
      const friend = this.friends[id];
      const user: User = this.context.rootState.users.users[id];
      return { recipient: user, ...friend };
    };
  }

  get friendsWithUser() {
    return Object.values(this.friends).map(friend => {
      const user: User = this.context.rootState.users.users[friend.uniqueID];
      const presence = PresencesModule.getPresence(friend.uniqueID);
      return { recipient: user, ...friend, presence };
    });
  }

  @Mutation
  private ADD_FRIEND(payload: { uniqueID: string; status: number }) {
    Vue.set(this.friends, payload.uniqueID, {
      status: payload.status,
      uniqueID: payload.uniqueID
    })
  }

  @Action
  public AddFriend(payload: { uniqueID: string; status: number }) {
    this.ADD_FRIEND(payload);
  }
  @Mutation
  private REMOVE_FRIEND(payload: { uniqueID: string}) {
    Vue.delete(this.friends, payload.uniqueID)
  }

  @Action
  public RemoveFriend(payload: { uniqueID: string}) {
    this.REMOVE_FRIEND(payload);
  }

  @Mutation
  private INIT_FRIENDS(payload: FriendObj | any) {
    this.friends = payload;
  }

  @Action
  public InitFriends(payload: FriendObj | any) {
    saveCache("friends", payload);
    this.INIT_FRIENDS(payload);
  }
}
export const FriendsModule = getModule(Friends);
