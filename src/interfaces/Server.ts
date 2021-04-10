export default interface Server {
  avatar: string;
  banner: string;
  creator: {
    id: string;
  };
  default_channel_id: string;
  name: string;
  server_id: string;
  verified: boolean;
  channel_position?: string[];
}
