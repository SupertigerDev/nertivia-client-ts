import User from "./User";

export default interface Message {
  message?: string;
  creator: User;
  messageID?: string;
  channelID: string;
  tempID?: string;
  type?: Type;
  sending?: Sending
  created: number;
  mentions?: User[];
  timeEdited?: number
}

enum Type {
  MESSAGE,
  JOIN_MESSAGE,
  LEAVE_MESSAGE,
  KICK_MESSAGE,
  BAN_MESSAGE
}

enum Sending {
  SENDING,
  SENT,
  FAILED,
}
