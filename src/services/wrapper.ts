import ky from "ky";
import config from "@/config";

export default ky.create({
  prefixUrl: config.fetchPrefix,
  retry: 0,
  headers: {
    authorization: localStorage.getItem("hauthid") || ""
  }
});
