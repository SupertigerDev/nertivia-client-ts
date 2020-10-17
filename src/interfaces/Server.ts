export default interface User {
  avatar: string;
  banner: string;
  creator: {
    uniqueID: string;
  };
  default_channel_id: string;
  name: string;
  server_id: string;
  verified: boolean;
  channel_position?: string[];
}
