import User from "./User";

export default interface Message {
  message?: string;
  creator: User;
  messageID?: string;
  channelID: string;
  tempID?: string;
  type?: Type;
  sending?: Sending;
  created: number;
  mentions?: User[];
  timeEdited?: number;
  files?: File[];
  quotes: Quote[];
}

export interface Quote {
  message: string;
  creator: User;
  messageID: string;
}

export interface File {
  dimensions?: { height: number; width: number };
  url: string;
  fileID?: string;
  fileName?: string;
}

export enum Type {
  MESSAGE,
  JOIN_MESSAGE,
  LEAVE_MESSAGE,
  KICK_MESSAGE,
  BAN_MESSAGE
}

export enum Sending {
  SENDING,
  SENT,
  FAILED
}
