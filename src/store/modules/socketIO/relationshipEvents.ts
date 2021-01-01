import ChannelWithUser from "@/interfaces/DmChannelWithUser";
import User from "@/interfaces/User";
import { ActionTree } from "vuex";
import { ChannelsModule } from "../channels";
import { FriendsModule } from "../friends";
import { MutedChannelsModule } from "../mutedChannels";
import { UsersModule } from "../users";

const actions: ActionTree<any, any> = {

  ["socket_relationshipRemove"](context, uniqueID) {
    FriendsModule.RemoveFriend({uniqueID})
  },
  ["socket_relationshipAccept"](context, uniqueID) {
    FriendsModule.AddFriend({status: 2, uniqueID})
  },
  ["socket_relationshipAdd"](context, payload: {recipient: User; status: number}) {
    console.log(payload)
    UsersModule.AddUser({
      tag: payload.recipient.tag,
      uniqueID: payload.recipient.uniqueID,
      username: payload.recipient.username,
      avatar: payload.recipient.avatar,
    })
    FriendsModule.AddFriend({
      status: payload.status,
      uniqueID: payload.recipient.uniqueID
    })
  }
};
export default {
  actions
};
