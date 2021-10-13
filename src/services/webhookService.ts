import Webhook from "@/interfaces/Webhook";
import wrapper from "./wrapper";

export function createWebhook(serverId: string): Promise<Webhook> {
  return wrapper().post(`servers/${serverId}/webhooks`).json();
}
export function getWebooks(serverId: string): Promise<Webhook[]> {
  return wrapper().get(`servers/${serverId}/webhooks`).json();
}
