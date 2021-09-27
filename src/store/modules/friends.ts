import {
  Module,
  VuexModule,
  Action,
  Mutation,
  getModule,
} from "vuex-module-decorators";
import store from "..";
import User from "@/interfaces/User";
import { saveCache } from "@/utils/localCache";
import { PresencesModule } from "./presences";

export enum FriendStatus {
  REQUESTED = 0,
  PENDING = 1,
  FRIENDS = 3,
}

interface FriendObj {
  [key: string]: {
    status: FriendStatus | number;
    id: string;
  };
}

@Module({ dynamic: true, store, namespaced: true, name: "friends" })
class Friends extends VuexModule {
  friends: FriendObj = {};

  get friendWithUser() {
    return (id: string) => {
      const friend = this.friends[id];
      if (!friend) return;
      const user: User = this.context.rootState.users.users[id];
      return { recipient: user, ...friend };
    };
  }

  get friendsWithUser() {
    return Object.values(this.friends).map((friend) => {
      const user: User = this.context.rootState.users.users[friend.id];
      const presence = PresencesModule.getPresence(friend.id);
      return { recipient: user, ...friend, presence };
    });
  }

  @Mutation
  private ADD_FRIEND(payload: { id: string; status: number }) {
    this.friends[payload.id] = {
      status: payload.status,
      id: payload.id,
    };
  }

  @Action
  public AddFriend(payload: { id: string; status: number }) {
    this.ADD_FRIEND(payload);
  }
  @Mutation
  private REMOVE_FRIEND(payload: { id: string }) {
    delete this.friends[payload.id];
  }

  @Action
  public RemoveFriend(payload: { id: string }) {
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
