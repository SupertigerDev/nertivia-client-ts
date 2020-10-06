import User from "./User";

export default interface Message {
  message?: string;
  creator: User;
  messageID?: string;
  channelID: string;
  tempID?: string;
  created: number;
  mentions?: User[];
}
