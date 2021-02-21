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
  [RELATIONSHIP_REMOVE](context, uniqueID) {
    FriendsModule.RemoveFriend({ uniqueID });
  },
  [RELATIONSHIP_ACCEPT](context, uniqueID) {
    FriendsModule.AddFriend({ status: 2, uniqueID });
  },
  [RELATIONSHIP_ADD](context, payload: { recipient: User; status: number }) {
    UsersModule.AddUser({
      tag: payload.recipient.tag,
      uniqueID: payload.recipient.uniqueID,
      username: payload.recipient.username,
      avatar: payload.recipient.avatar
    });
    FriendsModule.AddFriend({
      status: payload.status,
      uniqueID: payload.recipient.uniqueID
    });
  }
};
export default {
  actions
};
