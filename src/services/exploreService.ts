import wrapper from "./wrapper";
import User from "@/interfaces/User";
import Server from "@/interfaces/Server";
import { Theme } from "./themeService";
import { unzip } from "@/utils/zip";

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
  return wrapper().get(`explore/servers${param}`).json();
}
export function getServer(server_id: string): Promise<ServerResponse> {
  return wrapper().get(`explore/servers/${server_id}`).json();
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
  return wrapper().delete(`explore/servers/${server_id}`).text();
}
// themes
export interface PublicTheme {
  approved: boolean;
  css: string;
  description: string;
  id: string;
  name: string;
  screenshot?: string;
  updatedCss: boolean;
  compatible_client_version?: string;
}

export function getPublicTheme(themeID: string): Promise<any> {
  return wrapper().get(`explore/themes/${themeID}`).json();
}
export function addPublicTheme(themeID: string, data: any): Promise<any> {
  return wrapper().post(`explore/themes/${themeID}`, { json: data }).json();
}
export function updatePublicTheme(themeID: string, data: any): Promise<any> {
  return wrapper().patch(`explore/themes/${themeID}`, { json: data }).json();
}
export async function applyPublicTheme(themeID: string): Promise<any> {
  return await wrapper()
    .get(`explore/themes/${themeID}/apply`)
    .json<Theme>()
    .then(async (theme) => {
      return {
        ...theme,
        css: (await unzip(theme.css)) || theme.css,
      };
    });
}
export async function likeTheme(themeID: string): Promise<any> {
  return await wrapper().post(`explore/themes/${themeID}/like`).json();
}
export async function unlikeTheme(themeID: string): Promise<any> {
  return await wrapper().delete(`explore/themes/${themeID}/like`).json();
}

export interface PublicThemeResponse {
  creator: User;
  description: string;
  id: string;
  screenshot: string;
  theme: { name: string; id: string };
  likes?: number;
  liked?: boolean;
}
type SortTheme = "compatible";
type FilterTheme = "compatible";

export function getPublicThemes(
  sort?: SortTheme,
  filter?: FilterTheme,
  version?: string
): Promise<PublicThemeResponse[]> {
  let params = "?";
  if (sort) {
    params += `sort=${sort}&`;
  }
  if (filter) {
    if (filter !== "compatible") params += `filter=${filter}&`;
  }
  if (version) {
    params += `version=${version}&`;
  }
  params = params.slice(0, -1);

  return wrapper().get(`explore/themes${params}`).json();
}
