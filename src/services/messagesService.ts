import wrapper from "./wrapper";
import Message from "@/interfaces/Message";

interface Response {
  channelID: string;
  messages: Message[];
}
export function fetchMessages(channelID: string): Promise<Response> {
  return wrapper.get(`messages/channels/${channelID}`).json();
}
export function postMessage(message: string, tempID: string, channelID: string): Promise<Response> {
  return wrapper.post(`messages/channels/${channelID}`, {json: {message, tempID}}).json();
}
