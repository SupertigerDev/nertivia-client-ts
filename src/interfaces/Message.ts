import User from "./User";

export default interface Message {
  message?: string;
  creator: User;
  messageID?: string;
  channelID: string;
  tempID?: string;
  type?: Type
  created: number;
  mentions?: User[];
}

enum Type {
  MESSAGE,
  JOIN_MESSAGE,
  LEAVE_MESSAGE,
  KICK_MESSAGE,
  BAN_MESSAGE,
}

