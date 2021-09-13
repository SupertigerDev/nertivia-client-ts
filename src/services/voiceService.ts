import wrapper from "./wrapper";
import { socket } from "@/socket";

export function joinCall(channelID: string): Promise<any> {
  return wrapper()
    .post(`voice/channels/${channelID}`, { json: { socketId: socket.id } })
    .json();
}
export function leaveCall(): Promise<any> {
  return wrapper()
    .post(`voice/leave`)
    .json();
}
