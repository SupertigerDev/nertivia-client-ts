import { unzip } from "@/utils/zip";
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
