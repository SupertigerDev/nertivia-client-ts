import ky from "ky";

function createInstance() {
  return ky.create({
    prefixUrl: process.env.VUE_APP_FETCH_PREFIX,
    retry: 0,
    headers: {
      authorization: localStorage.getItem("hauthid") || ""
    }
  });
}

let instance = createInstance();

export default () => instance;

export function updateInstance() {
  instance = createInstance();
}
