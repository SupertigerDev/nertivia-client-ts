import wrapper from "./wrapper";
import User from "@/interfaces/User";
import Server from "@/interfaces/Server";

export interface ServerResponse {
  created: number;
  creator: User;
  description: string;
  id: string;
  server: Server;
  total_members: number;
}

export function getServers(
  param = "?verified=true"
): Promise<ServerResponse[]> {
  return wrapper()
    .get(`explore/servers${param}`)
    .json();
}
export function getServer(server_id: string): Promise<ServerResponse> {
  return wrapper()
    .get(`explore/servers/${server_id}`)
    .json();
}
export function addServer(
  server_id: string,
  description: string
  ): Promise<any> {
    return wrapper()
    .post(`explore/servers`, { json: { server_id, description } })
    .text();
  }
  export function updateServer(
    server_id: string,
    description: string
    ): Promise<any> {
      return wrapper()
      .patch(`explore/servers/${server_id}`, { json: { description } })
      .text();
    }
    export function deleteServer(server_id: string): Promise<any> {
      return wrapper()
      .delete(`explore/servers/${server_id}`)
      .text();
    }
    // themes
    export function getPublicTheme(themeID: string): Promise<any> {
      return wrapper()
        .get(`explore/themes/${themeID}`)
        .json();
    }