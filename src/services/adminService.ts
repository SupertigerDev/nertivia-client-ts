import User from "@/interfaces/User";
import wrapper from "./wrapper";

export interface Stats {
  userCount: number;
  serverCount: number;
  messageCount: number;
}
export function fetchStats(): Promise<Stats> {
  return wrapper().get(`admin/stats`).json();
}
export interface ExpandedUser {
  avatar: string | null;
  created: number;
  email: string;
  id: string;
  ip: string;
  tag: string;
  username: string;
  banner?: string;
  banned?: boolean;
  bot?: boolean;
}
export function fetchRecentUsers(): Promise<ExpandedUser[]> {
  return wrapper().get(`admin/users/recent`).json();
}

enum ActionType {
  SUSPEND_USER = "SUSPEND_USER",
  UNSUSPEND_USER = "UNSUSPEND_USER",
  BAN_IP = "BAN_IP",
  UNBAN_IP = "UNBAN_IP",
}
export interface Action {
  action: ActionType;
  reason?: string;
  user?: User;
  admin: User;
  bannedIP?: string;
  date: number;
}

export function fetchRecentActions(): Promise<Action[]> {
  return wrapper().get(`admin/actions/recent`).json();
}
export function searchUsers(value: string): Promise<ExpandedUser[]> {
  return wrapper()
    .get(`admin/users/search/${encodeURIComponent(value)}`)
    .json();
}
export function searchUsersByIP(user_id: string): Promise<ExpandedUser[]> {
  return wrapper()
    .get(`admin/users/ip/${encodeURIComponent(user_id)}`)
    .json();
}
export function suspendUser(
  id: string,
  password: string,
  reason: string
): Promise<any> {
  return wrapper()
    .post(`admin/users/${id}/suspend`, { json: { password, reason } })
    .json();
}
export function unsuspendUser(
  id: string,
  password: string,
  removeIPBan: boolean
): Promise<any> {
  return wrapper()
    .delete(`admin/users/${id}/suspend`, { json: { password, removeIPBan } })
    .json();
}
