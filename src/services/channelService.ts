import wrapper from "./wrapper";
import User from "@/interfaces/User";
import { ChannelType } from "@/interfaces/DmChannel";

interface Response {
  channel: ReturnedDmChannel;
  status: boolean;
}
interface ReturnedDmChannel {
  type: ChannelType
  channelId: string;
  recipients: User[];
}
export function getChannelByUserId(id: string): Promise<Response> {
  return wrapper().post(`channels/${id}`).json();
}

export function muteServerChannel(
  serverID: string,
  channelId: string
): Promise<any> {
  return wrapper().put(`servers/${serverID}/channels/${channelId}/mute`).json();
}
export function unmuteServerChannel(
  serverID: string,
  channelId: string
): Promise<any> {
  return wrapper()
    .delete(`servers/${serverID}/channels/${channelId}/mute`)
    .json();
}

export function updateServerChannel(
  channelId: string,
  serverID: string,
  data: any
): Promise<any> {
  return wrapper()
    .patch(`servers/${serverID}/channels/${channelId}`, { json: data })
    .json();
}
export function deleteServerChannel(
  channelId: string,
  serverID: string
): Promise<any> {
  return wrapper().delete(`servers/${serverID}/channels/${channelId}`).json();
}
export function createServerChannel(serverID: string, name: string, type = 1): Promise<any> {
  return wrapper()
    .put(`servers/${serverID}/channels`, {
      json: { name, type },
    })
    .json();
}
export function updateServerChannelPosition(
  serverID: string,
  channelIDArr: string[],
  category?: null | {id: string | null, channelId: string}
): Promise<any> {
  return wrapper()
    .put(`servers/${serverID}/channels/position`, {
      json: { channel_position: channelIDArr, category },
    })
    .json();
}
export function hideDMChannel(channelId: string): Promise<any> {
  return wrapper().delete(`channels/${channelId}`).json();
}
