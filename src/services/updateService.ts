export interface Changelog {
  version: string;
  date: string;
  title: string;
  new: string[];
  changes: string[];
  fixes: string[];
  body: string;
}

export async function getChangelog(): Promise<Changelog[]> {
  const val = await fetch("/changelog.json?nocache=" + Date.now());
  const json: Changelog[] = await val.json();
  return json;
}
