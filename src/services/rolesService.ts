import ServerRole from "@/interfaces/ServerRole";
import wrapper from "./wrapper";


export function createServerRole(serverID: string): Promise<ServerRole> {
  return wrapper()
    .post(`servers/${serverID}/roles`)
    .json();
}
