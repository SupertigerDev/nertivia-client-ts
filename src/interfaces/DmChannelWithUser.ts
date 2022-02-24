import { ChannelType } from "./DmChannel";
import User from "./User";

export default interface DmChannel {
  type: ChannelType;
  channelId: string;
  lastMessaged?: number;
  recipients?: User[];
}
