import User from "./User";

export default interface DmChannel {
  channelID: string;
  recipients?: string[];
}
