import ServerRole from "@/interfaces/ServerRole";
import wrapper from "./wrapper";

export function createServerRole(serverID: string): Promise<ServerRole> {
  return wrapper()
    .post(`servers/${serverID}/roles`)
    .json();
}
export function updateServerRole(
  serverID: string,
  roleID: string,
  data: Partial<ServerRole>
): Promise<Partial<ServerRole>> {
  return wrapper()
    .patch(`servers/${serverID}/roles/${roleID}`, { json: data })
    .json();
}
export function deleteServerRole(
  serverID: string,
  roleID: string
): Promise<any> {
  return wrapper()
    .delete(`servers/${serverID}/roles/${roleID}`)
    .json();
}
export function updateRolePosition(
  serverID: string,
  data: { roleID: string; order: number }
): Promise<any> {
  return wrapper()
    .patch(`servers/${serverID}/roles`, { json: data })
    .json();
}
