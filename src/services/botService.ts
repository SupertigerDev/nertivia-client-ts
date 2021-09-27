import User from "@/interfaces/User";
import wrapper from "./wrapper";

export function getBots(): Promise<User[]> {
  return wrapper().get("bots").json();
}
export function createBot(): Promise<User> {
  return wrapper().post("bots").json();
}
export function inviteBot(
  botID: string,
  serverID: string,
  permissions = 0
): Promise<any> {
  return wrapper()
    .put(`bots/${botID}/servers/${serverID}`, { json: { permissions } })
    .json();
}
export function deleteBot(botID: string): Promise<any> {
  return wrapper().delete(`bots/${botID}`).json();
}

export function getBot(
  botID: string,
  getToken?: boolean,
  getServers?: boolean
): Promise<User> {
  const searchParams: [string, string][] = [];
  if (getToken) {
    searchParams.push(["token", getToken.toString()]);
  }
  if (getServers) {
    searchParams.push(["myservers", getServers.toString()]);
  }
  return wrapper().get(`bots/${botID}`, { searchParams }).json();
}
export function updateBot(botID: string, data: any): Promise<any> {
  // idk why post... it should be patch. dumb fishie/pankeki/supertig-whatever.
  return wrapper().post(`bots/${botID}`, { json: data }).json();
}
export function resetBotToken(botID: string): Promise<any> {
  return wrapper().post(`bots/${botID}/reset-token`).json();
}
export function getBotCommands(botIDs: string[]): Promise<any> {
  let params = "";
  for (let i = 0; i < botIDs.length; i++) {
    const id = botIDs[i];
    if (params === "") {
      params = `0=${id}`;
      continue;
    }
    params += `&${i}=${id}`;
  }
  return wrapper().get("bots/commands", { searchParams: params }).json();
}
