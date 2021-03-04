import wrapper from "./wrapper";

interface Changelog {
  version: string
  title: string
  new: string[]
  changes: string[],
  fixes: string[],
  body: string
}

export async function getLatestVersion(): Promise<string> {
  const val = await fetch("/changelog.json");
  const json: Changelog[] = await val.json();
  return await json[0].version;
}
