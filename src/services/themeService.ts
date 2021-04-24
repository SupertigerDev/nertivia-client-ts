import { unzip, zip } from "@/utils/zip";
import wrapper from "./wrapper";

export interface Theme {
  css: string,
  name: string,
  id: string,
}
export type ThemePreview = Omit<Theme, 'css'>;

export function getThemes(): Promise<ThemePreview[]> {
  return wrapper()
    .get(`themes`)
    .json();
}
// also unzips
export async function getTheme(id: string) {
  return await wrapper()
    .get(`themes/${id}`)
    .json<Theme>().then(async theme => {
      return {
        ...theme,
        css: await unzip(theme.css) || theme.css
      };
    })
}
// also zips
export async function updateTheme(id: string, data: Omit<Theme, 'id'>) {
  const base64CSS = data.css && zip(data.css);
  const payload = {
    name: data.name,
    css: base64CSS
  }
  return await wrapper()
    .patch(`themes/${id}`, {json: payload})
    .json()
}
