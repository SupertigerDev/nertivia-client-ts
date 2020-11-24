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
  return wrapper.get(`explore/servers${param}`).json();
}
