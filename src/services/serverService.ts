import wrapper from "./wrapper";

export function kickMember(serverID: string, uniqueID: string): Promise<any> {
  return wrapper.delete(`servers/${serverID}/members/${uniqueID}`).json();
}
export function banMember(serverID: string, uniqueID: string): Promise<any> {
  return wrapper.put(`servers/${serverID}/bans/${uniqueID}`).json();
}

export function joinServerById(server_id: string, optionalData: any) {
  return wrapper
    .post(`servers/invite/servers/${server_id}`, { json: optionalData })
    .json();
}
