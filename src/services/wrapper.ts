import ky from "ky";
import config from "@/config";

function createInstance() {
  return ky.create({
    prefixUrl: config.fetchPrefix,
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
