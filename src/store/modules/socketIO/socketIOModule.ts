import notificationEvents from "./notificationEvents";
import channelEvents from "./channelEvents";
import serverEvents from "./serverEvents";
import userEvents from "./userEvents";
import relationshipEvents from "./relationshipEvents";
import customEmojiEvents from "./customEmojiEvents";

export default {
  namespace: true,
  modules: {
    notificationEvents,
    channelEvents,
    serverEvents,
    userEvents,
    relationshipEvents,
    customEmojiEvents
  }
};
