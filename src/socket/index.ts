import { AUTHENTICATED, AUTHENTICATION_ERROR, CHANNEL_CREATED, CHANNEL_DELETED, CHANNEL_MUTED, CHANNEL_UNMUTED, CONNECT, CUSTOM_EMOJI_DELETED, CUSTOM_EMOJI_RENAMED, CUSTOM_EMOJI_UPLOADED, GOOGLE_DRIVE_LINKED, MESSAGE_CREATED, MESSAGE_DELETED, MESSAGE_DELETED_BULK, MESSAGE_REACTION_UPDATED, MESSAGE_UPDATED, NOTIFICATION_DISMISSED, RECONNECT_ATTEMPT, RELATIONSHIP_ACCEPTED, RELATIONSHIP_ADDED, RELATIONSHIP_DELETED, SELF_CUSTOM_STATUS_CHANGE, SELF_STATUS_CHANGE, SERVER_CHANNEL_CREATED, SERVER_CHANNEL_DELETED, SERVER_CHANNEL_POSITION_UPDATED, SERVER_CHANNEL_UPDATED, SERVER_JOINED, SERVER_LEFT, SERVER_MEMBERS, SERVER_MEMBER_ADDED, SERVER_MEMBER_REMOVED, SERVER_MUTED, SERVER_POSITION_UPDATED, SERVER_ROLES, SERVER_ROLES_UPDATED, SERVER_ROLE_ADDED_TO_MEMBER, SERVER_ROLE_CREATED, SERVER_ROLE_DELETED, SERVER_ROLE_REMOVED_FROM_MEMBER, SERVER_ROLE_UPDATED, USER_BLOCKED, USER_CALL_JOINED, USER_CALL_LEFT, USER_CUSTOM_STATUS_CHANGED, USER_PROGRAM_ACTIVITY_CHANGED, USER_STATUS_CHANGED, USER_UNBLOCKED, VOICE_RETURN_SIGNAL_RECEIVED, VOICE_SIGNAL_RECEIVED } from "@/ServerEventNames";
import { io } from "socket.io-client";
import * as connectionEvents from "./events/connectionEvents";
import * as messageEvents from "./events/messageEvents";
import * as channelEvents from "./events/channelEvents";
import * as notificationEvents from "./events/notificationEvents";
import * as serverEvents from "./events/serverEvents";
import * as userEvents from "./events/userEvents";
import * as callEvents from "./events/callEvents";
import * as relationshipEvents from "./events/relationshipEvents";
import * as customEmojiEvents from "./events/customEmojiEvents";

export const socket = io(process.env.VUE_APP_SOCKET_URL as string, {
  autoConnect: false,
  transports: ["websocket"],
});

// connection events
socket.on(CONNECT, () => connectionEvents.onConnect(socket));
socket.io.on(RECONNECT_ATTEMPT, () =>
  connectionEvents.onReconnectAttempt(socket)
);
socket.on(AUTHENTICATED, (data) => connectionEvents.onSuccess(socket, data));
socket.on(AUTHENTICATION_ERROR, (data) => connectionEvents.onAuthError(socket, data));

// message events
socket.on(MESSAGE_CREATED, (data) => messageEvents.onMessage(socket, data));
socket.on(MESSAGE_UPDATED, (data) =>
  messageEvents.onMessageUpdate(socket, data)
);
socket.on(MESSAGE_DELETED, (data) =>
  messageEvents.onMessageDelete(socket, data)
);
socket.on(MESSAGE_DELETED_BULK, (data) =>
  messageEvents.onMessageDeleteBulk(socket, data)
);
socket.on(MESSAGE_REACTION_UPDATED, (data) =>
  messageEvents.onReactionUpdate(socket, data)
);

// channel events
socket.on(CHANNEL_CREATED, (data) => channelEvents.onChannelCreated(data));
socket.on(SERVER_CHANNEL_CREATED, (data) =>
  channelEvents.onServerChannelCreated(data)
);
socket.on(SERVER_CHANNEL_UPDATED, (data) =>
  channelEvents.onServerChannelUpdate(data)
);
socket.on(SERVER_CHANNEL_DELETED, (data) =>
  channelEvents.onServerChannelRemoved(data)
);
socket.on(CHANNEL_DELETED, (data) => channelEvents.onChannelRemoved(data));
socket.on(CHANNEL_UNMUTED, (data) => channelEvents.onChannelUnmute(data));
socket.on(CHANNEL_MUTED, (data) => channelEvents.onChannelMute(data));
socket.on(SERVER_CHANNEL_POSITION_UPDATED, (data) =>
  channelEvents.onServerChannelPositionChange(data)
);

// notification events
socket.on(NOTIFICATION_DISMISSED, (data) =>
  notificationEvents.onNotificationDismiss(data)
);

// server events
socket.on(SERVER_POSITION_UPDATED, (data) => serverEvents.onPositionChanged(data));
socket.on(SERVER_ROLE_ADDED_TO_MEMBER, (data) =>
  serverEvents.onMemberRoleAdded(data)
);
socket.on(SERVER_ROLE_REMOVED_FROM_MEMBER, (data) =>
  serverEvents.onMemberRoleRemoved(data)
);
socket.on(SERVER_JOINED, (data) => serverEvents.onJoined(socket, data));
socket.on(SERVER_LEFT, (data) => serverEvents.onLeave(data));
// get all members after joining the server
socket.on(SERVER_MEMBERS, (data) => serverEvents.onMembers(data));
// get all roles after joining the server
socket.on(SERVER_ROLES, (data) => serverEvents.onRoles(data));
socket.on(SERVER_ROLES_UPDATED, (data) => serverEvents.onRolesUpdate(data));
socket.on(SERVER_ROLE_CREATED, (data) => serverEvents.onRoleCreated(data));
socket.on(SERVER_ROLE_UPDATED, (data) => serverEvents.onRoleUpdated(data));
socket.on(SERVER_ROLE_DELETED, (data) => serverEvents.onRoleRemoved(data));
socket.on(SERVER_MUTED, (data) => serverEvents.onMute(data));
socket.on(SERVER_MEMBER_ADDED, (data) => serverEvents.onMemberAdd(data));
socket.on(SERVER_MEMBER_REMOVED, (data) => serverEvents.onMemberRemove(data));

// user events
socket.on(USER_STATUS_CHANGED, (data) => userEvents.onStatusChange(data));
socket.on(SELF_STATUS_CHANGE, (data) => userEvents.onSelfStatusChange(data));
socket.on(USER_CUSTOM_STATUS_CHANGED, (data) =>
  userEvents.onCustomStatusChange(data)
);
socket.on(SELF_CUSTOM_STATUS_CHANGE, (data) =>
  userEvents.onSelfCustomStatusChange(data)
);
socket.on(USER_PROGRAM_ACTIVITY_CHANGED, (data) =>
  userEvents.onProgramActivityChange(data)
);
socket.on(GOOGLE_DRIVE_LINKED, () => userEvents.onGoogleDriveLinked());
socket.on(USER_BLOCKED, (data) => userEvents.onUserBlocked(data));
socket.on(USER_UNBLOCKED, (data) => userEvents.onUserUnblocked(data));

// call events
socket.on(USER_CALL_JOINED, (data) => callEvents.onJoin(data));
socket.on(USER_CALL_LEFT, (data) => callEvents.onLeave(data));
socket.on(VOICE_SIGNAL_RECEIVED, (data) => callEvents.onReceiveSignal(data));
socket.on(VOICE_RETURN_SIGNAL_RECEIVED, (data) =>
  callEvents.onReceiveReturnSignal(data)
);

// relationship events
socket.on(RELATIONSHIP_ACCEPTED, (data) => relationshipEvents.onAccept(data));
socket.on(RELATIONSHIP_DELETED, (data) => relationshipEvents.onRemove(data));
socket.on(RELATIONSHIP_ADDED, (data) => relationshipEvents.onAdd(data));

// customEmoji Events

socket.on(CUSTOM_EMOJI_UPLOADED, (data) => customEmojiEvents.onUploaded(data));
socket.on(CUSTOM_EMOJI_RENAMED, (data) => customEmojiEvents.onRenamed(data));
socket.on(CUSTOM_EMOJI_DELETED, (data) => customEmojiEvents.onRemoved(data));
