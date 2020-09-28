import DmChannel from "./DMChannel";

export default interface Channel extends DmChannel {
  channelID: string;
  name?: string;
  lastMessaged?: number;
  server_id?: string;
}
