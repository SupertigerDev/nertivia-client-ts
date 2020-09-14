import wrapper from "./wrapper";
import Message from "@/interfaces/Message";

interface Response {
  channelID: string;
  messages: Message[];
}
export function fetchMessages(channelID: string): Promise<Response> {
  return wrapper.get(`messages/channels/${channelID}`).json();
}
