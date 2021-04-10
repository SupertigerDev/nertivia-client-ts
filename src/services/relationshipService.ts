import wrapper from "./wrapper";
import User from "@/interfaces/User";
import Server from "@/interfaces/Server";

export function sendFriendRequest(username: string, tag: string): Promise<any> {
  return wrapper()
    .post(`user/relationship`, { json: { username, tag } })
    .json();
}
export function deleteFriend(id: string): Promise<any> {
  return wrapper()
    .delete(`user/relationship`, { json: { id } })
    .json();
}
export function acceptRequest(id: string): Promise<any> {
  return wrapper()
    .put(`user/relationship`, { json: { id } })
    .json();
}
