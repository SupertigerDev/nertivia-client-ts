import { ChannelType } from "./DmChannel";
import User from "./User";

export default interface DmChannel {
  type: ChannelType;
  channelID: string;
  lastMessaged?: number;
  recipients?: User[];
}
