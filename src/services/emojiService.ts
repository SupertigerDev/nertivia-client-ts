import wrapper from "./wrapper";

export function deleteEmoji(id: string): Promise<any> {
  return wrapper()
    .delete(`account/emoji`, {
      json: { id },
    })
    .json();
}
export function updateEmoji(id: string, name: string): Promise<any> {
  return wrapper()
    .put(`account/emoji`, {
      json: { id, name },
    })
    .json();
}
export function uploadEmoji(name: string, avatar: string): Promise<any> {
  return wrapper()
    .post(`account/emoji`, {
      json: { name, avatar },
    })
    .json();
}
