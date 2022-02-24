import wrapper from "./wrapper";
import { socket } from "@/socket";

export function joinCall(channelId: string): Promise<any> {
  return wrapper()
    .post(`voice/channels/${channelId}`, { json: { socketId: socket.id } })
    .json();
}
export function leaveCall(): Promise<any> {
  return wrapper().post(`voice/leave`).json();
}
