import User from "@/interfaces/User";
import { unzip, unzipAlt } from "@/utils/zip";
import wrapper from "./wrapper";

export interface UpdateUserRequest {
  username?: string;
  tag?: string;
  password?: string;
  email?: string;
  new_password?: string;
  avatar?: string;
  banner?: string;
}

export function reportError(error: Error, val: string): Promise<any> {
  return wrapper()
    .post(`error_report`, {
      json: {
        message: error.message,
        name: error.name,
        stack: error.stack,
        user_message: val,
        url: location.href
      }
    })
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
export function changeCustomStatus(CustomStatus: string): Promise<any> {
  return wrapper()
    .post(`settings/custom-status`, {
      json: { custom_status: CustomStatus }
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
  id: string,
  roleID: string
): Promise<any> {
  return wrapper()
    .patch(`servers/${serverID}/members/${id}/roles/${roleID}`)
    .json();
}
export function removeRole(
  serverID: string,
  id: string,
  roleID: string
): Promise<any> {
  return wrapper()
    .delete(`servers/${serverID}/members/${id}/roles/${roleID}`)
    .json();
}
export function deleteAccount(password: string): Promise<any> {
  return wrapper()
    .delete(`user/delete-account`, { json: { password } })
    .json();
}
export function editHtmlProfile(html: string): Promise<any> {
  return wrapper()
    .post(`user/html-profile`, { json: { html } })
    .json();
}


export function getHtmlProfile(): Promise<jsonHtml[]> {
  return wrapper()
    .get(`user/html-profile`)
    .json().then((result: any) => {
      const jsonString = unzipAlt(result);
      return jsonString ? JSON.parse(jsonString) : null;
    })
}
export function deleteHtmlProfile(): Promise<any> {
  return wrapper()
    .delete(`user/html-profile`)
    .json()
}

export interface ReturnedUser {
  user: User & UserExtra;
  commonServersArr: string[];
  commonFriendsArr: string[];
}
interface UserExtra {
  about_me: AboutMe;
  created: number;
  badges?: number;
  createdBy?: User;
  htmlProfile?: jsonHtml
}
export interface jsonHtml {
  tag: string
  attributes: {[key: string]: string},
  content: (jsonHtml | string)[]
}
export interface AboutMe {
  about_me: string;
  age: string;
  continent: string;
  country: string;
  gender: string;
  name: string;
}
export function fetchUser(id: string): Promise<ReturnedUser> {
  return wrapper()
    .get(`user/${id}`)
    .json();
}
export function updateSurvay(data: AboutMe): Promise<any> {
  return wrapper()
    .put(`user/survey`, { json: data })
    .json();
}
export function logout(): Promise<any> {
  return wrapper()
    .delete(`user/logout`)
    .json();
}

// move to relationshipService.ts
export function blockUser(id: string): Promise<any> {
  return wrapper()
    .post(`user/block`, { json: { id } })
    .json();
}
export function UnblockUser(id: string): Promise<any> {
  return wrapper()
    .delete(`user/block`, { json: { id } })
    .json();
}
