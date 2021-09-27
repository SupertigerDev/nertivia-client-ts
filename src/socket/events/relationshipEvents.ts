import User from "@/interfaces/User";
import { FriendsModule } from "@/store/modules/friends";
import { UsersModule } from "@/store/modules/users";

export const onAccept = (id: string) => {
  FriendsModule.AddFriend({ status: 2, id });
};

export const onRemove = (id: string) => {
  FriendsModule.RemoveFriend({ id });
};

export const onAdd = (payload: { recipient: User; status: number }) => {
  UsersModule.AddUser({
    tag: payload.recipient.tag,
    id: payload.recipient.id,
    username: payload.recipient.username,
    avatar: payload.recipient.avatar,
  });
  FriendsModule.AddFriend({
    status: payload.status,
    id: payload.recipient.id,
  });
};
