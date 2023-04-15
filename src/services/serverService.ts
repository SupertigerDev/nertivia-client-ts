import wrapper from "./wrapper";

export interface UpdateServerRequest {
  avatar?: string;
  banner?: string;
  default_channel_id?: string;
  name?: string;
}
export function kickMember(serverID: string, id: string): Promise<any> {
  return wrapper().delete(`servers/${serverID}/members/${id}`).json();
}
export function getBannedUsers(serverID: string): Promise<any> {
  return wrapper().get(`servers/${serverID}/bans`).json();
}
export function banMember(serverID: string, id: string): Promise<any> {
  return wrapper().put(`servers/${serverID}/bans/${id}`).json();
}
export function unbanMember(serverID: string, id: string): Promise<any> {
  return wrapper().delete(`servers/${serverID}/bans/${id}`).json();
}
export function muteServer(serverID: string, type: number): Promise<any> {
  return wrapper().put(`servers/${serverID}/mute`, { json: { type } }).json();
}
export function leaveServer(serverID: string): Promise<any> {
  return wrapper().delete(`servers/${serverID}`).json();
}
export function deleteServer(serverID: string): Promise<any> {
  return wrapper().post(`servers/${serverID}/delete`).json();
}

export function joinServerById(server_id: string, optionalData: any) {
  return wrapper()
    .post(`servers/invite/servers/${server_id}`, { json: optionalData })
    .json();
}
export function createServer(name: string) {
  return wrapper().post(`servers`, { json: { name } }).json();
}
export function updateServer(
  serverID: string,
  data: UpdateServerRequest
): Promise<any> {
  return wrapper().patch(`servers/${serverID}`, { json: data }).json();
}
export function getServerInfoByCode(code: string) {
  return wrapper().get(`servers/invite/${code}`).json();
}
export function joinServerByCode(code: string, data?: any) {
  return wrapper().post(`servers/invite/${code}`, { json: data }).json();
}
export function getInvites(serverID: string): Promise<any> {
  return wrapper().get(`servers/${serverID}/invites`).json();
}
export function deleteInvite(inviteCode: string): Promise<any> {
  return wrapper().delete(`servers/invite/${inviteCode}`).json();
}
export function createInvite(serverID: string): Promise<any> {
  return wrapper().post(`servers/${serverID}/invite`).json();
}
export function changeServerPosition(serverPosition: string[]): Promise<any> {
  return wrapper()
    .put(`account/server_position`, {
      json: { server_position: serverPosition },
    })
    .json();
}

export function createCustomInvite(
  serverID: string,
  code: string
): Promise<any> {
  return wrapper()
    .post(`servers/${serverID}/invites/custom`, {
      json: {
        customCode: code,
      },
    })
    .json();
}
