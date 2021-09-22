import {
  AUTH_ERROR,
  CHANNEL_CREATED,
  CHANNEL_MUTE,
  CHANNEL_REMOVED,
  CHANNEL_UNMUTE,
  CONNECT,
  DELETE_MESSAGE,
  NOTIFICATION_DISMISS,
  RECEIVE_MESSAGE,
  RECONNECTING,
  SERVER_MEMBER_ADD_ROLE,
  SERVER_CHANNEL_CREATED,
  SERVER_CHANNEL_POSITION_CHANGE,
  SERVER_CHANNEL_REMOVED,
  SERVER_CHANNEL_UPDATE,
  SERVER_MEMBER_REMOVE_ROLE,
  SERVER_POSITION,
  SUCCESS,
  UPDATE_MESSAGE,
  SERVER_JOINED,
  SERVER_LEAVE,
  SERVER_MEMBERS,
  SERVER_MEMBER_ADD,
  SERVER_MEMBER_REMOVE,
  SERVER_ROLES,
  SERVER_UPDATE_ROLES,
  SERVER_CREATE_ROLE,
  SERVER_UPDATE_ROLE,
  SERVER_REMOVE_ROLE,
  SERVER_MUTE
} from "@/socketEventConstants";
import { io } from "socket.io-client";
import * as connectionEvents from "./events/connectionEvents";
import * as messageEvents from "./events/messageEvents";
import * as channelEvents from "./events/channelEvents";
import * as notificationEvents from "./events/notificationEvents";
import * as serverEvents from "./events/serverEvents";

export const socket = io(process.env.VUE_APP_SOCKET_URL as string, {
  autoConnect: false,
  transports: ["websocket"]
});

// connection events
socket.on(CONNECT, () => connectionEvents.onConnect(socket));
socket.on(RECONNECTING, () => connectionEvents.onReconnecting(socket));
socket.on(SUCCESS, data => connectionEvents.onSuccess(socket, data));
socket.on(AUTH_ERROR, data => connectionEvents.onAuthError(socket, data));

// message events
socket.on(RECEIVE_MESSAGE, data => messageEvents.onMessage(socket, data));
socket.on(UPDATE_MESSAGE, data => messageEvents.onMessageUpdate(socket, data));
socket.on(DELETE_MESSAGE, data => messageEvents.onMessageDelete(socket, data));

// channel events
socket.on(CHANNEL_CREATED, data => channelEvents.onChannelCreated(data));
socket.on(SERVER_CHANNEL_CREATED, data =>
  channelEvents.onServerChannelCreated(data)
);
socket.on(SERVER_CHANNEL_UPDATE, data =>
  channelEvents.onServerChannelUpdate(data)
);
socket.on(SERVER_CHANNEL_REMOVED, data =>
  channelEvents.onServerChannelRemoved(data)
);
socket.on(CHANNEL_REMOVED, data => channelEvents.onChannelRemoved(data));
socket.on(CHANNEL_UNMUTE, data => channelEvents.onChannelUnmute(data));
socket.on(CHANNEL_MUTE, data => channelEvents.onChannelMute(data));
socket.on(SERVER_CHANNEL_POSITION_CHANGE, data =>
  channelEvents.onServerChannelPositionChange(data)
);

// notification events
socket.on(NOTIFICATION_DISMISS, data =>
  notificationEvents.onNotificationDismiss(data)
);

// server events
socket.on(SERVER_POSITION, data => serverEvents.onPositionChanged(data));
socket.on(SERVER_MEMBER_ADD_ROLE, data => serverEvents.onMemberRoleAdded(data));
socket.on(SERVER_MEMBER_REMOVE_ROLE, data =>
  serverEvents.onMemberRoleRemoved(data)
);
socket.on(SERVER_JOINED, data => serverEvents.onJoined(socket, data));
socket.on(SERVER_LEAVE, data => serverEvents.onLeave(data));
// get all members after joining the server
socket.on(SERVER_MEMBERS, data => serverEvents.onMembers(data));
// get all roles after joining the server
socket.on(SERVER_ROLES, data => serverEvents.onRoles(data));
socket.on(SERVER_UPDATE_ROLES, data => serverEvents.onRolesUpdate(data));
socket.on(SERVER_CREATE_ROLE, data => serverEvents.onRoleCreated(data));
socket.on(SERVER_UPDATE_ROLE, data => serverEvents.onRoleUpdated(data));
socket.on(SERVER_REMOVE_ROLE, data => serverEvents.onRoleRemoved(data));
socket.on(SERVER_MUTE, data => serverEvents.onMute(data));
socket.on(SERVER_MEMBER_ADD, data => serverEvents.onMemberAdd(data));
socket.on(SERVER_MEMBER_REMOVE, data => serverEvents.onMemberRemove(data));
