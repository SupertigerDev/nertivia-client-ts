import wrapper from "./wrapper";

export function postLogin(
  email: string,
  password: string,
  token?: string
): Promise<any> {
  return wrapper()
    .post(`user/login`, {
      json: { email, password, token },
    })
    .json();
}
export function postRegister(
  username: string,
  email: string,
  password: string,
  token?: string
): Promise<any> {
  return wrapper()
    .post(`user/register`, {
      json: { username, email, password, token },
    })
    .json();
}
export function resetPasswordRequest(
  email: string,
  token?: string
): Promise<any> {
  return wrapper()
    .post(`user/reset/request`, {
      json: { email, token },
    })
    .json();
}
export function resetPassword(
  code: string,
  id: string,
  password?: string
): Promise<any> {
  return wrapper()
    .post(`user/reset/code/${code}`, {
      json: { id, password },
    })
    .json();
}
export function confirmEmail(email: string, code: string): Promise<any> {
  return wrapper()
    .post(`user/register/confirm`, {
      json: { email, code },
    })
    .json();
}
export function googleDriveLinkURL(): Promise<any> {
  return wrapper().get(`account/drive/url`).json();
}
export function GoogleDriveLink(code: string, token: string): Promise<any> {
  return wrapper()
    .post(`account/drive/auth`, { json: { code, token } })
    .json();
}
export function AgreePolicy(): Promise<any> {
  return wrapper().post(`user/agreeingPolicies`).json();
}
