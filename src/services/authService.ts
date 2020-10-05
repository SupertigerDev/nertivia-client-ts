import wrapper from "./wrapper";
import Message from "@/interfaces/Message";
import Vue from "vue";

const socket: () => SocketIOClient.Socket = () => Vue.prototype.$socket.client;


export function fetchMessages(channelID: string): Promise<any> {
  return wrapper.get(`messages/channels/${channelID}`).json();
}
export function postMessage(
  message: string,
  tempID: string,
  channelID: string
): Promise<any> {
  return wrapper
    .post(`messages/channels/${channelID}`, {
      json: { message, tempID, socketID: socket().id }
    })
    .json();
}
