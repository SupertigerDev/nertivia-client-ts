import connectionEvents from "./connectionEvents";
import messageEvents from "./messageEvents";
import notificationEvents from "./notificationEvents";

export default {
  namespace: true,
  modules: { connectionEvents, messageEvents, notificationEvents }
};
