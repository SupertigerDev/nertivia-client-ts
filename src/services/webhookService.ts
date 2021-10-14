import Webhook from "@/interfaces/Webhook";
import wrapper from "./wrapper";

export function createWebhook(serverId: string): Promise<Webhook> {
  return wrapper().post(`servers/${serverId}/webhooks`).json();
}
export function getWebooks(serverId: string): Promise<Webhook[]> {
  return wrapper().get(`servers/${serverId}/webhooks`).json();
}
export function getWebookToken(
  serverId: string,
  webhookId: string
): Promise<string> {
  return wrapper()
    .get(`servers/${serverId}/webhooks/${webhookId}/token`)
    .text();
}
export function deleteWebhook(
  serverId: string,
  webhookId: string
): Promise<any> {
  return wrapper().delete(`servers/${serverId}/webhooks/${webhookId}`).json();
}
export function updateWebhook(
  serverId: string,
  webhookId: string,
  data: { name?: string; channelId?: string }
): Promise<any> {
  return wrapper()
    .patch(`servers/${serverId}/webhooks/${webhookId}`, { json: data })
    .json();
}
