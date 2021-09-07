import Vue from "vue";
import wrapper from "./wrapper";
import SocketIO from "socket.io-client";

const socket = (() => Vue.prototype.$socket.client) as typeof SocketIO;

export function joinCall(channelID: string): Promise<any> {
  return wrapper()
    .post(`voice/channels/${channelID}`, { json: { socketId: socket().id } })
    .json();
}
export function leaveCall(): Promise<any> {
  return wrapper()
    .post(`voice/leave`)
    .json();
}