import { set, get } from "idb-keyval";

export function saveCache(name: string, data: any) {
  set("cached_" + name, JSON.parse(JSON.stringify(data)));
}
export function loadCache(name: string) {
  return get("cached_" + name);
}

export async function loadAllCacheToState(cachedStates: any) {
  for (let i = 0; i < cachedStates.length; i++) {
    const cachedState = cachedStates[i];
    const data = await loadCache(cachedState.storage);
    if (!data) continue;
    cachedState.state(data);
  }
}
