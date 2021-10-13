import Channel from "./Channel";
import User from "./User";

export default interface Webhook {
  id: string;
  name: string;
  creator: User;
  channel: Channel;
}
