export enum ChannelType {
  DM_CHANNEL = 0,
  SERVER_CHANNEL = 1,
  SERVER_CATEGORY = 2,
}
export default interface DmChannel {
  channelId: string;
  type: ChannelType;
  recipients?: string[];
}
