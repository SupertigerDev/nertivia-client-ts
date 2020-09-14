import connectionEvents from "./connectionEvents";
import messageEvents from "./messageEvents";

export default {
  namespace: true,
  modules: { connectionEvents, messageEvents }
};
