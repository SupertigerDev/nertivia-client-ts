import {
  Module,
  VuexModule,
  Action,
  Mutation,
  getModule
} from "vuex-module-decorators";
import store from "..";
import User from "@/interfaces/User";

interface FriendObj {
  [key: string]: {
    status: number;
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
    return Object.keys(this.friends).map(id => {
      return this.friendWithUser(id);
    });
  }

  @Mutation
  private ADD_FRIEND(payload: { uniqueID: string; status: number }) {
    this.friends[payload.uniqueID] = { status: payload.status };
  }

  @Action
  public AddFriend(payload: { uniqueID: string; status: number }) {
    this.ADD_FRIEND(payload);
  }

  @Mutation
  private INIT_FRIENDS(payload: FriendObj | any) {
    this.friends = payload;
  }

  @Action
  public InitFriends(payload: FriendObj | any) {
    this.INIT_FRIENDS(payload);
  }
}
export const FriendsModule = getModule(Friends);
