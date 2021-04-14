import User from "./User";
export default interface Message {
  message?: string;
  creator: User & UserExtra;
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
  embed?: Embed;
  // compressed
  htmlEmbed?: string;
  buttons?: Button[];
  localMessage?: boolean;
}

interface UserExtra {
  badges?: number;
}

export interface Button {
  id: string;
  name: string;
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
export interface Embed {
  title: string;
  type: string;
  site_name: string;
  description: string;
  url: string;
  image?: {
    url: string;
    dimensions: { height: number; width: number };
  };
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
