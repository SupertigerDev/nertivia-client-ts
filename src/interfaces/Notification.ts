import User from "./User";

export default interface Notification {
  channelID: string;
  count: number;
  lastMessageID: string;
  mentioned?: boolean;
  recipient?: string;
  sender: User;
  type?: string;
}
