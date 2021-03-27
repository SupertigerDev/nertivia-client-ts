import pako from "pako";

export function lastSelectedServerChannel(serverID: string) {
  if (!localStorage["lastSelectedServerChannel"]) {
    return null;
  }
  const json = JSON.parse(localStorage["lastSelectedServerChannel"]);
  if (!json[serverID]) return null;
  return json[serverID];
}

export function setLastSelectedServerChannel(serverID: string, channelID: string) {
  let json;
  if (!localStorage["lastSelectedServerChannel"]) {
    json = {}
  } else {
    json = JSON.parse(localStorage["lastSelectedServerChannel"]);
  }
  json[serverID] = channelID;
  localStorage["lastSelectedServerChannel"] = JSON.stringify(json);
}

