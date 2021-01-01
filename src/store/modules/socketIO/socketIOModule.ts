import connectionEvents from "./connectionEvents";
import messageEvents from "./messageEvents";
import notificationEvents from "./notificationEvents";
import channelEvents from "./channelEvents";
import serverEvents from "./serverEvents";
import userEvents from "./userEvents";
import relationshipEvents from "./relationshipEvents";

export default {
  namespace: true,
  modules: {
    connectionEvents,
    messageEvents,
    notificationEvents,
    channelEvents,
    serverEvents,
    userEvents,
    relationshipEvents
  }
};
