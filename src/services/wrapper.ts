import ky from "ky";

function createInstance() {
  return ky.create({
    prefixUrl: process.env.VUE_APP_FETCH_PREFIX,
    retry: 0,
    timeout: 60000,
    headers: {
      authorization: localStorage.getItem("hauthid") || "",
    },
    credentials: "include",
  });
}

let instance = createInstance();

export default () => instance;

export function updateInstance() {
  instance = createInstance();
}
