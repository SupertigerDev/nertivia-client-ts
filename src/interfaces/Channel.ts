import DmChannel from "./DmChannel";

export default interface Channel extends DmChannel {
  channelID: string;
  name?: string;
  lastMessaged?: number;
  server_id?: string;
  permissions?: ServerPermissions;
}
interface ServerPermissions {
  send_message?: boolean;
}
