import User from '@/interfaces/User';
import wrapper from "./wrapper";

export function changeStatus(status: number): Promise<any> {
  return wrapper
    .post(`settings/status`, {
      json: { status }
    })
    .json();
}

export interface ReturnedUser {
  user: User
}

export function fetchUser(uniqueID: string): Promise<ReturnedUser> {
  return wrapper
    .get(`user/${uniqueID}`)
    .json();
}

