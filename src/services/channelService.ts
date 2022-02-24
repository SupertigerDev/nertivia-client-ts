import wrapper from "./wrapper";
import User from "@/interfaces/User";
import { ChannelType } from "@/interfaces/DmChannel";

interface Response {
  channel: ReturnedDmChannel;
  status: boolean;
}
interface ReturnedDmChannel {
  type: ChannelType;
  channelID: string;
  recipients: User[];
}
export function getChannelByUserId(id: string): Promise<Response> {
  return wrapper().post(`channels/users/${id}`).json();
}

export function muteServerChannel(
  serverID: string,
  channelID: string
): Promise<any> {
  return wrapper().put(`servers/${serverID}/channels/${channelID}/mute`).json();
}
export function unmuteServerChannel(
  serverID: string,
  channelID: string
): Promise<any> {
  return wrapper()
    .delete(`servers/${serverID}/channels/${channelID}/mute`)
    .json();
}

export function updateServerChannel(
  channelID: string,
  serverID: string,
  data: any
): Promise<any> {
  return wrapper()
    .patch(`servers/${serverID}/channels/${channelID}`, { json: data })
    .json();
}
export function deleteServerChannel(
  channelID: string,
  serverID: string
): Promise<any> {
  return wrapper().delete(`servers/${serverID}/channels/${channelID}`).json();
}
export function createServerChannel(
  serverID: string,
  name: string,
  type = 1
): Promise<any> {
  return wrapper()
    .put(`servers/${serverID}/channels`, {
      json: { name, type },
    })
    .json();
}
export function updateServerChannelPosition(
  serverID: string,
  channelIDArr: string[],
  category?: null | { id: string | null; channelId: string }
): Promise<any> {
  return wrapper()
    .put(`servers/${serverID}/channels/position`, {
      json: { channel_position: channelIDArr, category },
    })
    .json();
}
export function hideDMChannel(channelID: string): Promise<any> {
  return wrapper().delete(`channels/${channelID}`).json();
}
