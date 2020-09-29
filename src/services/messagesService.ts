import wrapper from "./wrapper";
import Message from "@/interfaces/Message";
import Vue from "vue";

const socket: () => SocketIOClient.Socket = () => Vue.prototype.$socket.client;

interface ResponseFetch {
  channelID: string;
  messages: Message[];
}
interface ResponsePost {
  tempID: string;
  messageCreated: Message;
}
export function fetchMessages(channelID: string): Promise<ResponseFetch> {
  return wrapper.get(`messages/channels/${channelID}`).json();
}
export function postMessage(
  message: string,
  tempID: string,
  channelID: string
): Promise<ResponsePost> {
  return wrapper
    .post(`messages/channels/${channelID}`, {
      json: { message, tempID, socketID: socket().id }
    })
    .json();
}
