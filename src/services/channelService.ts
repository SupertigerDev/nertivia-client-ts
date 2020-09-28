import wrapper from "./wrapper";
import User from "@/interfaces/User";

interface Response {
  channel: ReturnedDmChannel;
  status: boolean;
}
interface ReturnedDmChannel {
  channelID: string;
  recipients: User[];
}
export function getChannelByUserId(uniqueID: string): Promise<Response> {
  return wrapper.post(`channels/${uniqueID}`).json();
}
