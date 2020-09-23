import DmChannel from "./DMChannel";

export default interface Channel extends DmChannel {
  channelID: string;
  name?: string;
  server_id?: string;
}
