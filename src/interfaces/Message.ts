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
  embed?: Embed
}

interface File {
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
  }
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
  FAILED
}
