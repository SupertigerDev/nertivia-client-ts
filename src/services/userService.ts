import User from "@/interfaces/User";
import wrapper from "./wrapper";

export function changeStatus(status: number): Promise<any> {
  return wrapper
    .post(`settings/status`, {
      json: { status }
    })
    .json();
}

export function addRole(serverID: string, uniqueID: string, roleID: string): Promise<any> {
  return wrapper
    .patch(`servers/${serverID}/members/${uniqueID}/roles/${roleID}`)
    .json();
}
export function removeRole(serverID: string, uniqueID: string, roleID: string): Promise<any> {
  return wrapper
    .delete(`servers/${serverID}/members/${uniqueID}/roles/${roleID}`)
    .json();
}


export interface ReturnedUser {
  user: User & UserExtra;
}
interface UserExtra {
  about_me: AboutMe;
  created: number;
}

interface AboutMe {
  about_me: string;
  age: string;
  continent: string;
  country: string;
  gender: string;
  name: string;
}
export function fetchUser(uniqueID: string): Promise<ReturnedUser> {
  return wrapper.get(`user/${uniqueID}`).json();
}
