import User from "@/interfaces/User";
import wrapper from "./wrapper";

export interface UpdateUserRequest {
  username?: string;
  tag?: string;
  password?: string;
  email?: string;
  new_password?: string;
  avatar?: string;
}

export function reportError(error: Error, val: string): Promise<any> {
  alert(error.stack?.length)
  return wrapper()
    .post(`error_report`, {json: {
      message: error.message,
      name: error.name,
      stack: error.stack,
      user_message: val,
      url: location.href
    }})
    .json();
}

export function getUser(): Promise<any> {
  return wrapper()
    .get(`user`)
    .json();
}
export function updateUser(
  data: UpdateUserRequest,
  socketID: string
): Promise<any> {
  return wrapper()
    .patch(`user`, { json: { ...data, socketID } })
    .json();
}
export function changeStatus(status: number): Promise<any> {
  return wrapper()
    .post(`settings/status`, {
      json: { status }
    })
    .json();
}
export function registerFCM(token: string): Promise<any> {
  return wrapper()
    .post(`devices`, {
      json: { token }
    })
    .json();
}

export function addRole(
  serverID: string,
  uniqueID: string,
  roleID: string
): Promise<any> {
  return wrapper()
    .patch(`servers/${serverID}/members/${uniqueID}/roles/${roleID}`)
    .json();
}
export function removeRole(
  serverID: string,
  uniqueID: string,
  roleID: string
): Promise<any> {
  return wrapper()
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
  return wrapper()
    .get(`user/${uniqueID}`)
    .json();
}
export function logout(): Promise<any> {
  return wrapper()
    .delete(`user/logout`)
    .json();
}
