import wrapper from "./wrapper";
import User from "@/interfaces/User";

interface Response {
  channel: ReturnedDmChannel;
  status: boolean;
}
interface ReturnedDmChannel {
  channelID: string;
  recipients: User[];
}
export function getChannelByUserId(id: string): Promise<Response> {
  return wrapper().post(`channels/${id}`).json();
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
export function createServerChannel(serverID: string): Promise<any> {
  return wrapper()
    .put(`servers/${serverID}/channels`, { json: { name: "New Channel" } })
    .json();
}
export function updateServerChannelPosition(
  serverID: string,
  channelIDArr: string[]
): Promise<any> {
  return wrapper()
    .put(`servers/${serverID}/channels/position`, {
      json: { channel_position: channelIDArr },
    })
    .json();
}
export function hideDMChannel(channelID: string): Promise<any> {
  return wrapper().delete(`channels/${channelID}`).json();
}
