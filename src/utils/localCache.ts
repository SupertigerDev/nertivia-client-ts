export function saveCache(name: string, data: any) {
  localStorage.setItem("cached_" + name, JSON.stringify(data));
}
export function loadCache(name: string) {
  return JSON.parse(localStorage.getItem("cached_" + name) as any);
}

export function loadAllCacheToState(cachedStates: any) {
  for (let i = 0; i < cachedStates.length; i++) {
    const cachedState = cachedStates[i];
    const data = loadCache(cachedState.storage);
    if (!data) continue;
    cachedState.state(data);
  }
}
