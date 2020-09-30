import connectionEvents from "./connectionEvents";
import messageEvents from "./messageEvents";
import notificationEvents from "./notificationEvents";
import channelEvents from "./channelEvents";

export default {
  namespace: true,
  modules: { connectionEvents, messageEvents, notificationEvents, channelEvents }
};
