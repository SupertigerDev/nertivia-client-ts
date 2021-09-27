import { unzip, zip } from "@/utils/zip";
import wrapper from "./wrapper";

export interface Theme {
  css: string;
  name: string;
  client_version?: string;
  id: string;
}
export type ThemePreview = Omit<Theme, "css">;

export function getThemes(): Promise<ThemePreview[]> {
  return wrapper().get(`themes`).json();
}
// also unzips
export async function getTheme(id: string) {
  return await wrapper()
    .get(`themes/${id}`)
    .json<Theme>()
    .then(async (theme) => {
      return {
        ...theme,
        css: (await unzip(theme.css)) || theme.css,
      };
    });
}
// also zips
export async function updateTheme(id: string, data: Omit<Theme, "id">) {
  const payload: any = {
    name: data.name,
    client_version: data.client_version,
  };
  data.css && (payload.css = zip(data.css));
  return await wrapper().patch(`themes/${id}`, { json: payload }).json();
}
export async function deleteTheme(id: string) {
  return await wrapper().delete(`themes/${id}`).json();
}
// also zips
export async function createTheme(data: Omit<Theme, "id">): Promise<Theme> {
  const payload = {
    name: data.name,
    css: zip(data.css),
    client_version: data.client_version,
  };
  return await wrapper().post(`themes`, { json: payload }).json();
}
