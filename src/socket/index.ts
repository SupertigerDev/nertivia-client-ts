import {
  AUTH_ERROR,
  CONNECT,
  DELETE_MESSAGE,
  RECEIVE_MESSAGE,
  RECONNECTING,
  SUCCESS,
  UPDATE_MESSAGE
} from "@/socketEventConstants";
import { io } from "socket.io-client";
import * as connectionEvents from "./events/connectionEvents";
import * as messageEvents from "./events/messageEvents";

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
