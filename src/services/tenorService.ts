import wrapper from "./wrapper";

export interface TenorCategory {
  name: string;
  previewUrl: string;
}

export function tenorCategories(): Promise<TenorCategory[]> {
  return wrapper().get(`tenor/categories`).json();
}

export interface TenorSearch {
  dims: number[];
  duration: number[];
  preview: string;
  size: number;
  url: string;
  siteUrl: string;
}

export function tenorSearch(value: string): Promise<TenorSearch[]> {
  return wrapper()
    .get(`tenor/search/${encodeURIComponent(value)}`)
    .json();
}
