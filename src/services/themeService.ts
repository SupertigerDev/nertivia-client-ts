import wrapper from "./wrapper";

export interface ThemeDetail {
  name: string,
  id: string,
}

export function getThemes(): Promise<ThemeDetail[]> {
  return wrapper()
    .get(`themes`)
    .json();
}
