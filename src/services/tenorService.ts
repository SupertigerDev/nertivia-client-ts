import wrapper from "./wrapper";


export interface TenorCategory {
  name: string;
  previewUrl: string;
}

export function tenorCategories(): Promise<TenorCategory[]> {
  return wrapper().get(`tenor/categories`).json();
}

export function tenorSearch(value: string): Promise<string[]> {
  return wrapper()
    .get(`tenor/categories/${encodeURIComponent(value)}`)
    .json();
}
