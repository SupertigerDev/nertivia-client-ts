import wrapper from "./wrapper";

export function postLogin(
  email: string,
  password: string,
  token?: string
): Promise<any> {
  return wrapper
    .post(`user/login`, {
      json: { email, password, token }
    })
    .json();
}
export function postRegister(
  username: string,
  email: string,
  password: string,
  token?: string
): Promise<any> {
  return wrapper
    .post(`user/register`, {
      json: { username, email, password, token }
    })
    .json();
}
export function confirmEmail(email: string, code: string): Promise<any> {
  return wrapper
    .post(`user/register/confirm`, {
      json: { email, code }
    })
    .json();
}
