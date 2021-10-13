import wrapper from "./wrapper";

interface PostWebhookResponse {
  id: string;
  name: string;
}

export function createWebhook(serverId: string): Promise<PostWebhookResponse> {
  return wrapper().post(`servers/${serverId}/webhooks`).json();
}
