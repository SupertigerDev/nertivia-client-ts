import DmChannel from "./DmChannel";
export default interface Channel extends DmChannel {
  channelId: string;
  name?: string;
  categoryId?: string | null;
  lastMessaged?: number;
  server_id?: string;
  permissions?: ServerPermissions;
  rateLimit?: number;
  icon?: string | undefined;
}
interface ServerPermissions {
  send_message?: boolean;
}