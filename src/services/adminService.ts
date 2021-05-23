import wrapper from "./wrapper";

export function deleteEmoji(emojiID: string): Promise<any> {
  return wrapper()
    .delete(`settings/emoji`, {
      json: { emojiID }
    })
    .json();
}

export interface Stats {
  userCount: number
  serverCount: number
  messageCount: number
}
export function fetchStats(): Promise<Stats> {
  return wrapper()
    .get(`admin/stats`).json();
}
