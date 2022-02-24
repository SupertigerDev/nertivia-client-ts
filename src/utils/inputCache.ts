// store input area text when switching channels

function getAllInputCache(): { [key: string]: string } {
  const jsonStr = localStorage["inputCache"];
  if (!jsonStr) return {};
  return JSON.parse(jsonStr);
}

function addInputCache(channelId: string, message: string) {
  const cache = getAllInputCache();
  cache[channelId] = message.substring(0, 5000);
  localStorage["inputCache"] = JSON.stringify(cache);
}

export function getInputCache(channelId: string) {
  return getAllInputCache()[channelId];
}

export function deleteInputCache(channelId: string) {
  const cache = getAllInputCache();
  delete cache[channelId];
  localStorage["inputCache"] = JSON.stringify(cache);
}
export function cacheInput(channelId: string, message?: string) {
  if (!message?.trim()) {
    deleteInputCache(channelId);
    return;
  }
  addInputCache(channelId, message);
}
