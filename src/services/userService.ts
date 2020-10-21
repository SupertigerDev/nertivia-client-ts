import wrapper from "./wrapper";


export function changeStatus(status: number): Promise<any> {
  return wrapper
    .post(`settings/status`, {
      json: { status }
    })
    .json();
}
