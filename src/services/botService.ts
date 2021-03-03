import wrapper from "./wrapper";

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
  return wrapper()
    .get("bots/commands", { searchParams: params })
    .json();
}
