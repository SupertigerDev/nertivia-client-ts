import wrapper from "./wrapper";
import User from "@/interfaces/User";
import Server from "@/interfaces/Server";

export function sendFriendRequest(username: string, tag: string): Promise<any> {
  return wrapper.post(`user/relationship`, { json: { username, tag } }).json();
}
