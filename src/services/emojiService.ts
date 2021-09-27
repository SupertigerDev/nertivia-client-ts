import wrapper from "./wrapper";

export function deleteEmoji(emojiID: string): Promise<any> {
  return wrapper()
    .delete(`settings/emoji`, {
      json: { emojiID },
    })
    .json();
}
export function updateEmoji(emojiID: string, name: string): Promise<any> {
  return wrapper()
    .put(`settings/emoji`, {
      json: { emojiID, name },
    })
    .json();
}
export function uploadEmoji(name: string, avatar: string): Promise<any> {
  return wrapper()
    .post(`settings/emoji`, {
      json: { name, avatar },
    })
    .json();
}
