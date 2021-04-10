import ChannelWithUser from "@/interfaces/DmChannelWithUser";
import User from "@/interfaces/User";
import {
  RELATIONSHIP_ACCEPT,
  RELATIONSHIP_ADD,
  RELATIONSHIP_REMOVE
} from "@/socketEventConstants";
import { ActionTree } from "vuex";
import { ChannelsModule } from "../channels";
import { FriendsModule } from "../friends";
import { MutedChannelsModule } from "../mutedChannels";
import { UsersModule } from "../users";

const actions: ActionTree<any, any> = {
  [RELATIONSHIP_REMOVE](context, id) {
    FriendsModule.RemoveFriend({ id });
  },
  [RELATIONSHIP_ACCEPT](context, id) {
    FriendsModule.AddFriend({ status: 2, id });
  },
  [RELATIONSHIP_ADD](context, payload: { recipient: User; status: number }) {
    UsersModule.AddUser({
      tag: payload.recipient.tag,
      id: payload.recipient.id,
      username: payload.recipient.username,
      avatar: payload.recipient.avatar
    });
    FriendsModule.AddFriend({
      status: payload.status,
      id: payload.recipient.id
    });
  }
};
export default {
  actions
};
